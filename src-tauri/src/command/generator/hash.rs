use md5::{Digest, Md5};
use serde::{Deserialize, Serialize};
use sha1::Sha1;
use sha2::{Sha224, Sha256, Sha384, Sha512};
use sha3::{Sha3_224, Sha3_256, Sha3_384, Sha3_512};
use sm3::Sm3;

use crate::command_error;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Algorithm {
    Fsb160,
    Fsb224,
    Fsb256,
    Fsb384,
    Fsb512,
    Md2,
    Md4,
    Md5,
    Sha1,
    Sha224,
    Sha256,
    Sha384,
    Sha512,
    Sm3,
    Sha3_224,
    Sha3_256,
    Sha3_384,
    Sha3_512,
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret)]
pub fn generate_text_hash(text: &str, algorithm: Algorithm, uppercase: bool) -> String {
    digest(text.as_bytes(), algorithm, uppercase)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret)]
pub fn generate_file_hash(
    file: &str,
    algorithm: Algorithm,
    uppercase: bool,
) -> Result<String, Error> {
    let bytes = std::fs::read(file)?;
    Ok(digest(&bytes, algorithm, uppercase))
}

macro_rules! digest {
    ($ty:ty, $bytes:expr) => {
        format!("{:x}", <$ty>::digest($bytes))
    };
}

fn digest(bytes: &[u8], algorithm: Algorithm, uppercase: bool) -> String {
    let hash = match algorithm {
        Algorithm::Md2 => digest!(md2::Md2, bytes),
        Algorithm::Md4 => digest!(md4::Md4, bytes),
        Algorithm::Md5 => digest!(Md5, bytes),
        Algorithm::Sha1 => digest!(Sha1, bytes),
        Algorithm::Sha224 => digest!(Sha224, bytes),
        Algorithm::Sha256 => digest!(Sha256, bytes),
        Algorithm::Sha384 => digest!(Sha384, bytes),
        Algorithm::Sha512 => digest!(Sha512, bytes),
        Algorithm::Sm3 => digest!(Sm3, bytes),
        Algorithm::Sha3_224 => digest!(Sha3_224, bytes),
        Algorithm::Sha3_256 => digest!(Sha3_256, bytes),
        Algorithm::Sha3_384 => digest!(Sha3_384, bytes),
        Algorithm::Sha3_512 => digest!(Sha3_512, bytes),
        Algorithm::Fsb160 => digest!(fsb::Fsb160, bytes),
        Algorithm::Fsb224 => digest!(fsb::Fsb224, bytes),
        Algorithm::Fsb256 => digest!(fsb::Fsb256, bytes),
        Algorithm::Fsb384 => digest!(fsb::Fsb384, bytes),
        Algorithm::Fsb512 => digest!(fsb::Fsb512, bytes),
    };
    match uppercase {
        true => hash.to_uppercase(),
        false => hash,
    }
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
}
