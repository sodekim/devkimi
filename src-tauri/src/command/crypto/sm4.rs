use super::symmetric::Error;
use crate::command::crypto::block_mode::BlockMode;
use crate::command::crypto::padding::Padding;
use crate::encoding::{Encoding, EncodingText};
use crate::{decrypt_symmetric, encrypt_symmetric, generate_iv, generate_key};
use crypto_common::{KeyInit, KeyIvInit};
use sm4::Sm4;

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn generate_sm4_key(encoding: Encoding) -> Result<String, Error> {
    generate_key!(Sm4, encoding)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn generate_sm4_iv(block_mode: BlockMode, encoding: Encoding) -> Result<String, Error> {
    generate_iv!(Sm4, block_mode, encoding)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn encrypt_sm4(
    input: EncodingText,
    key: EncodingText,
    iv: Option<EncodingText>,
    block_mode: BlockMode,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error> {
    encrypt_symmetric!(Sm4, input, key, iv, block_mode, padding, encoding, 128)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn decrypt_sm4(
    input: EncodingText,
    key: EncodingText,
    iv: Option<EncodingText>,
    block_mode: BlockMode,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error> {
    decrypt_symmetric!(Sm4, input, key, iv, block_mode, padding, encoding, 128)
}
