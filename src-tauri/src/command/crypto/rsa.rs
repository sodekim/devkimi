use base64::{prelude::BASE64_STANDARD, Engine};
use pkcs1::{DecodeRsaPrivateKey, DecodeRsaPublicKey, EncodeRsaPrivateKey, EncodeRsaPublicKey};
use pkcs8::{DecodePrivateKey, DecodePublicKey, EncodePrivateKey, EncodePublicKey};
use rand::thread_rng;
use rsa::{Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey};
use serde::{Deserialize, Serialize};

use crate::command_error;

#[derive(Debug, Serialize, Deserialize)]
pub enum KeyFormat {
    Pkcs1,
    Pkcs8,
}

#[tauri::command(async)]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn generate_rsa_key_pair(
    key_format: KeyFormat,
    bit_size: usize,
) -> Result<(String, String), Error> {
    let mut rng = thread_rng();
    let private_key = RsaPrivateKey::new(&mut rng, bit_size)?;
    let public_key = private_key.to_public_key();
    match key_format {
        KeyFormat::Pkcs1 => {
            let private_key_pem = private_key
                .to_pkcs1_pem(pkcs8::LineEnding::CRLF)?
                .to_string();
            let public_key_pem = public_key.to_pkcs1_pem(pkcs8::LineEnding::CRLF)?;
            Ok((private_key_pem, public_key_pem))
        }
        KeyFormat::Pkcs8 => {
            let private_key_pem = private_key
                .to_pkcs8_pem(pkcs8::LineEnding::CRLF)?
                .to_string();
            let public_key_pem = public_key
                .to_public_key_pem(pkcs8::LineEnding::CRLF)
                .map_err(|e| Error::Spki(e.to_string()))?;
            Ok((private_key_pem, public_key_pem))
        }
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn encrypt_rsa(key_format: KeyFormat, public_key: &str, text: &str) -> Result<String, Error> {
    let public_key = match key_format {
        KeyFormat::Pkcs1 => RsaPublicKey::from_pkcs1_pem(public_key)?,
        KeyFormat::Pkcs8 => {
            RsaPublicKey::from_public_key_pem(public_key).map_err(|e| Error::Spki(e.to_string()))?
        }
    };
    let mut rng = thread_rng();
    public_key
        .encrypt(&mut rng, Pkcs1v15Encrypt, text.as_bytes())
        .map(|bytes| BASE64_STANDARD.encode(bytes))
        .map_err(Into::into)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn decrypt_rsa(key_format: KeyFormat, private_key: &str, text: &str) -> Result<String, Error> {
    let private_key = match key_format {
        KeyFormat::Pkcs1 => RsaPrivateKey::from_pkcs1_pem(private_key)?,
        KeyFormat::Pkcs8 => RsaPrivateKey::from_pkcs8_pem(private_key)?,
    };
    let bytes = BASE64_STANDARD.decode(text)?;
    let bytes = private_key.decrypt(Pkcs1v15Encrypt, &bytes)?;
    String::from_utf8(bytes).map_err(Into::into)
}

command_error! {
   (Rsa, "rsa error: {0}", #[from] rsa::Error),
   (Pkcs1, "pkcs1 error: {0}", #[from] pkcs1::Error),
   (Pkcs8, "pkcs8 error: {0}", #[from] pkcs8::Error),
   (Spki, "spki error: {0}", String),
   (Base64Decode,"decode base64 error: {0}", #[from] base64::DecodeError),
   (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}
