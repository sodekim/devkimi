use base64::{prelude::BASE64_STANDARD, Engine};
use serde::{Deserialize, Serialize};
use sm2::elliptic_curve::pkcs8::{
    DecodePrivateKey, DecodePublicKey, EncodePrivateKey, EncodePublicKey, LineEnding,
};
use sm2::elliptic_curve::sec1::{FromEncodedPoint, ToEncodedPoint};
use sm2::pke::{DecryptingKey, EncryptingKey, Mode};
use sm2::{EncodedPoint, PublicKey, SecretKey};

use crate::command_error;

/// SM2 密钥格式
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum KeyFormat {
    /// SEC1 PEM 格式
    Sec1,
    /// PKCS#8 PEM 格式
    Pkcs8,
    /// Hex 格式（裸数据）
    Hex,
}

/// 用于 SM2 的随机数生成器
struct Sm2Rng;

impl sm2::elliptic_curve::rand_core::RngCore for Sm2Rng {
    fn next_u32(&mut self) -> u32 {
        let mut buf = [0u8; 4];
        getrandom::fill(&mut buf).expect("getrandom failed");
        u32::from_le_bytes(buf)
    }

    fn next_u64(&mut self) -> u64 {
        let mut buf = [0u8; 8];
        getrandom::fill(&mut buf).expect("getrandom failed");
        u64::from_le_bytes(buf)
    }

    fn fill_bytes(&mut self, dest: &mut [u8]) {
        getrandom::fill(dest).expect("getrandom failed");
    }
}

impl sm2::elliptic_curve::rand_core::CryptoRng for Sm2Rng {}

#[tauri::command(async)]
pub fn generate_sm2_key_pair(key_format: KeyFormat) -> Result<(String, String), Error> {
    let secret_key = SecretKey::try_from_rng(&mut Sm2Rng).expect("Failed to generate secret key");
    let public_key = secret_key.public_key();

    match key_format {
        KeyFormat::Sec1 => {
            // 私钥转换为 SEC1 PEM 格式
            let sk_pem = secret_key
                .to_sec1_pem(LineEnding::LF)
                .map_err(|e| Error::Pem(e.to_string()))?
                .to_string();
            // 公钥转换为 SPKI PEM 格式
            let pk_pem = public_key
                .to_public_key_pem(LineEnding::LF)
                .map_err(|e| Error::Pem(e.to_string()))?;
            Ok((sk_pem, pk_pem))
        }
        KeyFormat::Pkcs8 => {
            // 私钥转换为 PKCS#8 PEM 格式
            let sk_pem = secret_key
                .to_pkcs8_pem(LineEnding::LF)
                .map_err(|e| Error::Pem(e.to_string()))?
                .to_string();
            // 公钥转换为 SPKI PEM 格式
            let pk_pem = public_key
                .to_public_key_pem(LineEnding::LF)
                .map_err(|e| Error::Pem(e.to_string()))?;
            Ok((sk_pem, pk_pem))
        }
        KeyFormat::Hex => {
            // 私钥转换为 Hex 格式（32字节）
            let sk_hex = hex::encode(secret_key.to_bytes());
            // 公钥转换为 Hex 格式（非压缩，65字节：04 + X + Y）
            let pk_hex = hex::encode(public_key.to_encoded_point(false).as_bytes());
            Ok((sk_hex, pk_hex))
        }
    }
}

#[tauri::command]
pub fn encrypt_sm2(key_format: KeyFormat, public_key: &str, text: &str) -> Result<String, Error> {
    let public_key = match key_format {
        KeyFormat::Sec1 | KeyFormat::Pkcs8 => {
            // PEM 格式使用 SPKI 解析
            PublicKey::from_public_key_pem(public_key).map_err(|e| Error::Pem(e.to_string()))?
        }
        KeyFormat::Hex => {
            // Hex 格式解析（非压缩格式，04 + X + Y）
            let pk_bytes = hex::decode(public_key)?;
            let encoded_point =
                EncodedPoint::from_bytes(&pk_bytes).map_err(|e| Error::Pem(e.to_string()))?;
            Option::from(PublicKey::from_encoded_point(&encoded_point))
                .ok_or_else(|| Error::Pem("Invalid public key".to_string()))?
        }
    };

    let encrypting_key = EncryptingKey::new_with_mode(public_key, Mode::C1C3C2);
    let ciphertext = encrypting_key
        .encrypt(&mut Sm2Rng, text.as_bytes())
        .map_err(|e| Error::Encryption(e.to_string()))?;

    Ok(BASE64_STANDARD.encode(ciphertext))
}

#[tauri::command]
pub fn decrypt_sm2(key_format: KeyFormat, private_key: &str, text: &str) -> Result<String, Error> {
    let secret_key = match key_format {
        KeyFormat::Sec1 => {
            SecretKey::from_sec1_pem(private_key).map_err(|e| Error::Pem(e.to_string()))?
        }
        KeyFormat::Pkcs8 => {
            SecretKey::from_pkcs8_pem(private_key).map_err(|e| Error::Pem(e.to_string()))?
        }
        KeyFormat::Hex => {
            // Hex 格式解析（32字节私钥）
            let sk_bytes = hex::decode(private_key)?;
            SecretKey::from_slice(&sk_bytes)?
        }
    };

    let decrypting_key = DecryptingKey::new_with_mode(secret_key.to_nonzero_scalar(), Mode::C1C3C2);
    let ciphertext = BASE64_STANDARD.decode(text)?;

    let plaintext = decrypting_key
        .decrypt(&ciphertext)
        .map_err(|e| Error::Decryption(e.to_string()))?;

    String::from_utf8(plaintext).map_err(Into::into)
}

command_error! {
    (Pem, "pem error: {0}", String),
    (EllipticCurve, "elliptic curve error: {0}", #[from] sm2::elliptic_curve::Error),
    (Encryption, "encryption error: {0}", String),
    (Decryption, "decryption error: {0}", String),
    (Base64Decode, "decode base64 error: {0}", #[from] base64::DecodeError),
    (HexDecode, "decode hex error: {0}", #[from] hex::FromHexError),
    (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}
