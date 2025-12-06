use crate::command::crypto::padding::Padding;
use crate::command_error;
use crate::encoding::Encoding;
use cipher::block_padding::{AnsiX923, Iso10126, Iso7816, NoPadding, Pkcs7, ZeroPadding};
use cipher::{BlockDecryptMut, BlockEncryptMut, StreamCipher};

#[doc(hidden)]
#[allow(unused)]
pub fn encrypt_block<C>(
    encryptor: C,
    input: &[u8],
    pos: usize,
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error>
where
    C: BlockEncryptMut,
{
    let mut buffer = vec![0; input.len() + 16];
    buffer[..pos].copy_from_slice(&input);
    let output = match padding {
        Padding::Pkcs7 => encryptor.encrypt_padded_mut::<Pkcs7>(&mut buffer, pos),
        Padding::AnsiX923 => encryptor.encrypt_padded_mut::<AnsiX923>(&mut buffer, pos),
        Padding::Iso7816 => encryptor.encrypt_padded_mut::<Iso7816>(&mut buffer, pos),
        Padding::Iso10126 => encryptor.encrypt_padded_mut::<Iso10126>(&mut buffer, pos),
        Padding::Zero => encryptor.encrypt_padded_mut::<ZeroPadding>(&mut buffer, pos),
        Padding::None => encryptor.encrypt_padded_mut::<NoPadding>(&mut buffer, pos),
    }?;
    encoding.encode(output).map_err(Into::into)
}

#[doc(hidden)]
#[allow(unused)]
pub fn encrypt_stream<C>(
    mut encryptor: C,
    input: &mut [u8],

    encoding: Encoding,
) -> Result<String, Error>
where
    C: StreamCipher,
{
    encryptor.apply_keystream(input);
    encoding.encode(&input).map_err(Into::into)
}

#[macro_export]
macro_rules! encrypt_symmetric {
    ($ty:ty, $input:expr, $key:expr, $iv:expr, $block_mode:expr, $padding:expr, $encoding:expr, $bit_size:literal) => {{
        let key = $key.to_bytes()?;
        // 除了CBC模式，其他模式都需要iv。
        if BlockMode::Ecb != $block_mode && $iv.is_none() {
            return Err(Error::RequiredIv($block_mode));
        }
        let iv = match $iv {
            None => vec![],
            Some(iv) => iv.to_bytes()?,
        };
        let mut input = $input.to_bytes()?;
        let pos = input.len();

        // 加密模式
        match $block_mode {
            // 块机密
            BlockMode::Cbc => {
                let encryptor = cbc::Encryptor::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::encrypt_block(
                    encryptor, &input, pos, $padding, $encoding,
                )
            }
            BlockMode::Cfb => {
                let encryptor = cfb_mode::Encryptor::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::encrypt_block(
                    encryptor, &input, pos, $padding, $encoding,
                )
            }
            BlockMode::Ecb => {
                let encryptor = ecb::Encryptor::<$ty>::new_from_slice(&key)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::encrypt_block(
                    encryptor, &input, pos, $padding, $encoding,
                )
            }

            // 流加密
            BlockMode::Ofb => {
                let encryptor = ofb::Ofb::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::encrypt_stream(encryptor, &mut input, $encoding)
            }
            BlockMode::Ctr => {
                let encryptor = ctr::Ctr32BE::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::encrypt_stream(encryptor, &mut input, $encoding)
            }
        }
    }};
}

#[macro_export]
macro_rules! decrypt_symmetric {
    ($ty:ty, $input:expr, $key:expr, $iv:expr, $block_mode:expr, $padding:expr, $encoding:expr, $bit_size:literal) => {{
        let key = $key.to_bytes()?;
        // 除了CBC模式，其他模式都需要iv。
        if BlockMode::Ecb != $block_mode && $iv.is_none() {
            return Err(Error::RequiredIv($block_mode));
        }
        let iv = match $iv {
            None => vec![],
            Some(iv) => iv.to_bytes()?,
        };
        let mut input = $input.to_bytes()?;
        match $block_mode {
            // 块解密
            BlockMode::Cbc => {
                let decryptor = cbc::Decryptor::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::decrypt_block(
                    decryptor, &mut input, $padding, $encoding,
                )
            }
            BlockMode::Cfb => {
                let decryptor = cfb_mode::Decryptor::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::decrypt_block(
                    decryptor, &mut input, $padding, $encoding,
                )
            }
            BlockMode::Ecb => {
                let decryptor = ecb::Decryptor::<$ty>::new_from_slice(&key)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::decrypt_block(
                    decryptor, &mut input, $padding, $encoding,
                )
            }

            // 流解密
            BlockMode::Ofb => {
                let decryptor = ofb::Ofb::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::decrypt_stream(decryptor, &mut input, $encoding)
            }
            BlockMode::Ctr => {
                let decryptor = ctr::Ctr32BE::<$ty>::new_from_slices(&key, &iv)
                    .map_err(|_| Error::InvalidLength($bit_size))?;
                $crate::command::crypto::symmetric::decrypt_stream(decryptor, &mut input, $encoding)
            }
        }
    }};
}

#[doc(hidden)]
pub fn decrypt_block<C>(
    decryptor: C,
    input: &mut [u8],
    padding: Padding,
    encoding: Encoding,
) -> Result<String, Error>
where
    C: BlockDecryptMut,
{
    let output = match padding {
        Padding::Pkcs7 => decryptor.decrypt_padded_mut::<Pkcs7>(input),
        Padding::AnsiX923 => decryptor.decrypt_padded_mut::<AnsiX923>(input),
        Padding::Iso7816 => decryptor.decrypt_padded_mut::<Iso7816>(input),
        Padding::Iso10126 => decryptor.decrypt_padded_mut::<Iso10126>(input),
        Padding::Zero => decryptor.decrypt_padded_mut::<ZeroPadding>(input),
        Padding::None => decryptor.decrypt_padded_mut::<NoPadding>(input),
    }?;
    encoding.encode(output).map_err(Into::into)
}

#[doc(hidden)]
pub fn decrypt_stream<C>(
    mut decryptor: C,
    input: &mut [u8],
    encoding: Encoding,
) -> Result<String, Error>
where
    C: StreamCipher,
{
    decryptor.apply_keystream(input);
    encoding.encode(&input).map_err(Into::into)
}

command_error! {
    (InvalidLength, "invalid key length, must be {0} bits", usize),
    (Pad, "Pad error", #[from] inout::PadError),
    (Unpad, "UnPad error", #[from] cipher::block_padding::UnpadError),
    (RequiredIv, "block mode `{0:?}` required iv", crate::command::crypto::block_mode::BlockMode),
    (Encoding, "encoding error", #[from] crate::encoding::EncodingError)
}

#[macro_export]
macro_rules! generate_key {
    ($ty:ty, $encoding:expr) => {{
        let mut rng = rand::thread_rng();
        let key = <$ty as crypto_common::KeyInit>::generate_key(&mut rng);
        match $encoding {
            Encoding::Utf8 => Encoding::Hex
                .encode(&key[0..key.len() / 2])
                .map_err(Into::into),
            _ => $encoding.encode(&key).map_err(Into::into),
        }
    }};
}

#[macro_export]
macro_rules! generate_iv {
    ($ty:ty, $block_mode:expr, $encoding:expr) => {{
        let mut rng = rand::thread_rng();
        let key = match $block_mode {
            BlockMode::Cbc => cbc::Encryptor::<$ty>::generate_iv(&mut rng).to_vec(),
            BlockMode::Cfb => cfb_mode::Encryptor::<$ty>::generate_iv(&mut rng).to_vec(),
            BlockMode::Ofb => ofb::Ofb::<$ty>::generate_iv(&mut rng).to_vec(),
            BlockMode::Ctr => ctr::Ctr32BE::<$ty>::generate_iv(&mut rng).to_vec(),
            BlockMode::Ecb => unreachable!("ECB mode is not supported for generate iv!"),
        };
        match $encoding {
            Encoding::Utf8 => Encoding::Hex
                .encode(&key[0..key.len() / 2])
                .map_err(Into::into),
            _ => $encoding.encode(&key).map_err(Into::into),
        }
    }};
}
