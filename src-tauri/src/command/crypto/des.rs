use super::block_mode::BlockMode;
use super::padding::Padding;
use crate::command::crypto::symmetric::Error;
use crate::{
    decrypt_symmetric,
    encoding::{Encoding, EncodingText},
    encrypt_symmetric, generate_iv, generate_key,
};
use crypto_common::{KeyInit, KeyIvInit};
use des::{Des, TdesEde3};
use serde::{Deserialize, Serialize};

/// DES 密钥长度
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum BitSize {
    /// DES - 64 bits (8 bytes)
    Bits64,
    /// 3DES (Triple DES) - 192 bits (24 bytes)
    Bits192,
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn generate_des_key(bit_size: BitSize, encoding: Encoding) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits64 => generate_key!(Des, encoding),
        BitSize::Bits192 => generate_key!(TdesEde3, encoding),
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn generate_des_iv(
    bit_size: BitSize,
    block_mode: BlockMode,
    encoding: Encoding,
) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits64 => generate_iv!(Des, block_mode, encoding),
        BitSize::Bits192 => generate_iv!(TdesEde3, block_mode, encoding),
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn encrypt_des(
    bit_size: BitSize,
    input: EncodingText,
    key: EncodingText,
    iv: Option<EncodingText>,
    block_mode: BlockMode,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits64 => {
            encrypt_symmetric!(Des, input, key, iv, block_mode, padding, encoding, 64)
        }
        BitSize::Bits192 => {
            encrypt_symmetric!(TdesEde3, input, key, iv, block_mode, padding, encoding, 192)
        }
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn decrypt_des(
    bit_size: BitSize,
    input: EncodingText,
    key: EncodingText,
    iv: Option<EncodingText>,
    block_mode: BlockMode,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits64 => {
            decrypt_symmetric!(Des, input, key, iv, block_mode, padding, encoding, 64)
        }
        BitSize::Bits192 => {
            decrypt_symmetric!(TdesEde3, input, key, iv, block_mode, padding, encoding, 192)
        }
    }
}
