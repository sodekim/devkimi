use crate::{command_error, encoding::EncodingText};
use cipher::KeyInit;
use hmac::Hmac;
use jwt::{
    token::Signed, AlgorithmType, Header, JoseHeader, PKeyWithDigest, SignWithKey,
    SigningAlgorithm, ToBase64, Token, Unsigned, VerifyWithKey, VerifyingAlgorithm,
};
use openssl::{
    ec::{EcGroup, EcKey},
    hash::MessageDigest,
    nid::Nid,
    pkey::PKey,
    rsa::Rsa,
};
use serde_json::Value;
use sha2::{Sha256, Sha384, Sha512};
use std::collections::BTreeMap;

type Claims = BTreeMap<String, serde_json::Value>;

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn generate_jwt_rsa_key_pair(bit_size: u32) -> Result<(String, String), Error> {
    let rsa = Rsa::generate(bit_size)?;
    let private_key = rsa.private_key_to_pem()?;
    let public_key = rsa.public_key_to_pem()?;
    Ok((
        String::from_utf8(private_key)?,
        String::from_utf8(public_key)?,
    ))
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn generate_jwt_ecdsa_key_pair(algorithm: AlgorithmType) -> Result<(String, String), Error> {
    let ec_group = match algorithm {
        AlgorithmType::Es256 => EcGroup::from_curve_name(Nid::X9_62_PRIME256V1),
        AlgorithmType::Es384 => EcGroup::from_curve_name(Nid::SECP384R1),
        AlgorithmType::Es512 => EcGroup::from_curve_name(Nid::SECP521R1),
        _ => unreachable!(),
    }?;
    let ec_key = EcKey::generate(&ec_group)?;
    let private_key = ec_key.private_key_to_pem()?;
    let public_key = ec_key.public_key_to_pem()?;
    Ok((
        String::from_utf8(private_key)?,
        String::from_utf8(public_key)?,
    ))
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn encode_jwt(header: Header, payload: String, key: EncodingText) -> Result<String, Error> {
    let payload = serde_json::from_str::<Claims>(&payload)?;
    let algorithm = header.algorithm;
    let unsigned = Token::new(header, payload);
    let signed = match algorithm {
        AlgorithmType::Hs256 => sign_hs::<Hmac<Sha256>, _, _>(key, unsigned),
        AlgorithmType::Hs384 => sign_hs::<Hmac<Sha384>, _, _>(key, unsigned),
        AlgorithmType::Hs512 => sign_hs::<Hmac<Sha512>, _, _>(key, unsigned),
        AlgorithmType::Rs256 => sign_rs(MessageDigest::sha256(), key, unsigned),
        AlgorithmType::Rs384 => sign_rs(MessageDigest::sha384(), key, unsigned),
        AlgorithmType::Rs512 => sign_rs(MessageDigest::sha512(), key, unsigned),
        AlgorithmType::Es256 => sign_ec(MessageDigest::sha256(), key, unsigned),
        AlgorithmType::Es384 => sign_ec(MessageDigest::sha384(), key, unsigned),
        AlgorithmType::Es512 => sign_ec(MessageDigest::sha512(), key, unsigned),
        _ => unreachable!(),
    }?;
    Ok(signed.as_str().to_string())
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn decode_jwt(
    token: &str,
    key: Option<EncodingText>,
) -> Result<(Value, String, Option<bool>), Error> {
    let unverified = Token::<Header, Claims, _>::parse_unverified(token)
        .map(|token| token.remove_signature())?;
    let key = key.filter(|s| !s.text.is_empty());
    let verifed = match key {
        Some(key) => Some(match unverified.header().algorithm {
            AlgorithmType::Hs256 => verify_hs::<Hmac<Sha256>>(token, key),
            AlgorithmType::Hs384 => verify_hs::<Hmac<Sha384>>(token, key),
            AlgorithmType::Hs512 => verify_hs::<Hmac<Sha512>>(token, key),
            AlgorithmType::Rs256 => verify_rs(MessageDigest::sha256(), token, key),
            AlgorithmType::Rs384 => verify_rs(MessageDigest::sha384(), token, key),
            AlgorithmType::Rs512 => verify_rs(MessageDigest::sha512(), token, key),
            AlgorithmType::Es256 => verify_ec(MessageDigest::sha256(), token, key),
            AlgorithmType::Es384 => verify_ec(MessageDigest::sha384(), token, key),
            AlgorithmType::Es512 => verify_ec(MessageDigest::sha512(), token, key),
            _ => unreachable!(),
        }?),
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
    (Encoding, "encoding error: {0}", #[from] crate::encoding::EncodingError),
    (OpenSsl, "openssl error: {0}", #[from] openssl::error::ErrorStack),
    (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}

fn sign_hs<T, H, C>(
    key: EncodingText,
    token: Token<H, C, Unsigned>,
) -> Result<Token<H, C, Signed>, Error>
where
    T: KeyInit,
    T: SigningAlgorithm,
    H: ToBase64 + JoseHeader,
    C: ToBase64,
{
    let bytes = key.to_bytes()?;
    let key = T::new_from_slice(&bytes).map_err(|_| Error::InvalidLength(bytes.len() * 8))?;
    token.sign_with_key(&key).map_err(Error::Jwt)
}

fn sign_rs<H, C>(
    digest: MessageDigest,
    key: EncodingText,
    token: Token<H, C, Unsigned>,
) -> Result<Token<H, C, Signed>, Error>
where
    H: ToBase64 + JoseHeader,
    C: ToBase64,
{
    let bytes = key.to_bytes()?;
    let rsa = Rsa::private_key_from_pem(&bytes)?;
    let key = PKey::from_rsa(rsa)?;
    let key_with_digest = PKeyWithDigest { digest, key };
    token.sign_with_key(&key_with_digest).map_err(Into::into)
}

fn sign_ec<H, C>(
    digest: MessageDigest,
    key: EncodingText,
    token: Token<H, C, Unsigned>,
) -> Result<Token<H, C, Signed>, Error>
where
    H: ToBase64 + JoseHeader,
    C: ToBase64,
{
    let bytes = key.to_bytes()?;
    let ec_key = EcKey::private_key_from_pem(&bytes)?;
    let key = PKey::from_ec_key(ec_key)?;
    let key_with_digest = PKeyWithDigest { digest, key };
    token.sign_with_key(&key_with_digest).map_err(Into::into)
}

fn verify_hs<T>(token: &str, key: EncodingText) -> Result<bool, Error>
where
    T: KeyInit,
    T: VerifyingAlgorithm,
{
    let bytes = key.to_bytes()?;
    let key = T::new_from_slice(&bytes).map_err(|_| Error::InvalidLength(bytes.len() * 8))?;
    Ok(VerifyWithKey::<Token<Header, Claims, _>>::verify_with_key(token, &key).is_ok())
}

fn verify_rs(digest: MessageDigest, token: &str, key: EncodingText) -> Result<bool, Error> {
    let bytes = key.to_bytes()?;
    let rsa = Rsa::public_key_from_pem(&bytes)?;
    let key = PKey::from_rsa(rsa)?;

    let key_with_digest = PKeyWithDigest { digest, key };
    Ok(VerifyWithKey::<Token<Header, Claims, _>>::verify_with_key(token, &key_with_digest).is_ok())
}

fn verify_ec(digest: MessageDigest, token: &str, key: EncodingText) -> Result<bool, Error> {
    let bytes = key.to_bytes()?;
    let ec_key = EcKey::public_key_from_pem(&bytes)?;
    let key = PKey::from_ec_key(ec_key)?;
    let key_with_digest = PKeyWithDigest { digest, key };
    Ok(VerifyWithKey::<Token<Header, Claims, _>>::verify_with_key(token, &key_with_digest).is_ok())
}
