use super::block_mode::BlockMode;
use super::padding::Padding;
use crate::command::crypto::bit_size::BitSize;
use crate::command::crypto::symmetric::Error;
use crate::{
    decrypt_symmetric,
    encoding::{Encoding, EncodingText},
    encrypt_symmetric, generate_iv, generate_key,
};
use aes::{Aes128, Aes192, Aes256};
use crypto_common::{KeyInit, KeyIvInit};

#[tauri::command]
pub fn generate_aes_key(bit_size: BitSize, encoding: Encoding) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits128 => generate_key!(Aes128, encoding),
        BitSize::Bits192 => generate_key!(Aes192, encoding),
        BitSize::Bits256 => generate_key!(Aes256, encoding),
    }
}

#[tauri::command]
pub fn generate_aes_iv(
    bit_size: BitSize,
    block_mode: BlockMode,
    encoding: Encoding,
) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits128 => generate_iv!(Aes128, block_mode, encoding),
        BitSize::Bits192 => generate_iv!(Aes192, block_mode, encoding),
        BitSize::Bits256 => generate_iv!(Aes256, block_mode, encoding),
    }
}

#[tauri::command]
pub fn encrypt_aes(
    bit_size: BitSize,
    input: EncodingText,
    key: EncodingText,
    iv: Option<EncodingText>,
    block_mode: BlockMode,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits128 => {
            encrypt_symmetric!(Aes128, input, key, iv, block_mode, padding, encoding, 128)
        }
        BitSize::Bits192 => {
            encrypt_symmetric!(Aes192, input, key, iv, block_mode, padding, encoding, 192)
        }
        BitSize::Bits256 => {
            encrypt_symmetric!(Aes256, input, key, iv, block_mode, padding, encoding, 256)
        }
    }
}

#[tauri::command]
pub fn decrypt_aes(
    bit_size: BitSize,
    input: EncodingText,
    key: EncodingText,
    iv: Option<EncodingText>,
    block_mode: BlockMode,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error> {
    match bit_size {
        BitSize::Bits128 => {
            decrypt_symmetric!(Aes128, input, key, iv, block_mode, padding, encoding, 128)
        }
        BitSize::Bits192 => {
            decrypt_symmetric!(Aes192, input, key, iv, block_mode, padding, encoding, 192)
        }
        BitSize::Bits256 => {
            decrypt_symmetric!(Aes256, input, key, iv, block_mode, padding, encoding, 256)
        }
    }
}

#[cfg(test)]
mod test {
    use crate::encoding::{Encoding, EncodingText};
    use aes::Aes192;
    use crypto_common::KeyIvInit;

    #[test]
    fn test_aes() {
        let key = EncodingText::new("123456781234567812345678", Encoding::Utf8);
        let iv = EncodingText::new("1234567812345678", Encoding::Utf8);
        let key = key.to_bytes().unwrap();
        let iv = iv.to_bytes().unwrap();
        let encryptor = cbc::Encryptor::<Aes192>::new_from_slices(&key, &iv).unwrap();
    }
}
