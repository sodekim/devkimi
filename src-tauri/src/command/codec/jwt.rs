use crate::{command_error, encoding::EncodingText};
use cipher::KeyInit;
use hmac::Hmac;
use jwt::{Header, SignWithKey, Token, VerifyWithKey};
use serde_json::Value;
use sha2::{Sha256, Sha384, Sha512};
use std::collections::BTreeMap;

type Claims = BTreeMap<String, serde_json::Value>;

macro_rules! sign {
    ($ty:ty, $secret:expr, $token:expr, $bit_size:literal) => {{
        match $secret.to_bytes() {
            Ok(bytes) => match <$ty>::new_from_slice(&bytes) {
                Ok(key) => $token.sign_with_key(&key).map_err(Error::Jwt),
                Err(_) => Err(Error::InvalidLength($bit_size)),
            },
            Err(e) => Err(Error::Encoding(e)),
        }
    }};
}

macro_rules! verify {
    ($ty:ty, $secret:expr, $token:expr, $bit_size:literal) => {{
        match $secret.to_bytes() {
            Ok(bytes) => match <$ty>::new_from_slice(&bytes) {
                Ok(key) => {
                    match VerifyWithKey::<Token<Header, Claims, _>>::verify_with_key($token, &key) {
                        Ok(_) => Ok(Some(true)),
                        Err(_) => Ok(Some(false)),
                    }
                }
                Err(_) => Err(Error::InvalidLength($bit_size)),
            },
            Err(e) => Err(Error::Encoding(e)),
        }
    }};
}

#[tauri::command]
pub fn encode_jwt(header: Header, payload: String, secret: EncodingText) -> Result<String, Error> {
    let payload = serde_json::from_str::<Claims>(&payload)?;
    let algorithm: jwt::AlgorithmType = header.algorithm;
    let unsigned = Token::new(header, payload);
    let signed = match algorithm {
        jwt::AlgorithmType::Hs256 => sign!(Hmac::<Sha256>, secret, unsigned, 256),
        jwt::AlgorithmType::Hs384 => sign!(Hmac::<Sha384>, secret, unsigned, 384),
        jwt::AlgorithmType::Hs512 => sign!(Hmac::<Sha512>, secret, unsigned, 512),
        _ => sign!(Hmac::<Sha256>, secret, unsigned, 256),
    }?;
    Ok(signed.as_str().to_string())
}

#[tauri::command]
pub fn decode_jwt(
    token: &str,
    secret: Option<EncodingText>,
) -> Result<(Value, String, Option<bool>), Error> {
    let unverified = Token::<Header, Claims, _>::parse_unverified(token)
        .map(|token| token.remove_signature())?;
    let secret = secret.filter(|s| !s.text.is_empty());
    let verifed = match secret {
        Some(secret) => match unverified.header().algorithm {
            jwt::AlgorithmType::Hs256 => verify!(Hmac::<Sha256>, secret, token, 256)?,
            jwt::AlgorithmType::Hs384 => verify!(Hmac::<Sha384>, secret, token, 384)?,
            jwt::AlgorithmType::Hs512 => verify!(Hmac::<Sha512>, secret, token, 512)?,
            _ => Some(false),
        },
        None => None,
    };
    let header = serde_json::to_value(unverified.header())?;
    let payload = serde_json::to_string_pretty(unverified.claims())?;
    Ok((header, payload, verifed))
}

command_error! {
    (Json, "invalid json: {0}", #[from] serde_json::Error),
    (InvalidLength, "invalid key length, must be {0} bits", usize),
    (Jwt, "jwt error: {0}", #[from] jwt::Error),
    (Encoding, "encoding error: {0}", #[from] crate::encoding::EncodingError)
}
