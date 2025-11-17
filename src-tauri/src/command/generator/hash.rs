use md5::{Digest, Md5};
use serde::{Deserialize, Serialize};
use sha1::Sha1;
use sha2::{Sha256, Sha384, Sha512};
use sm3::Sm3;

use crate::command_error;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Algorithm {
    Md5,
    Sha1,
    Sha256,
    Sha384,
    Sha512,
    Sm3,
}

#[tauri::command]
pub fn generate_text_hash(text: &str, algorithm: Algorithm, uppercase: bool) -> String {
    digest(text.as_bytes(), algorithm, uppercase)
}

#[tauri::command]
pub fn generate_file_hash(
    file: &str,
    algorithm: Algorithm,
    uppercase: bool,
) -> Result<String, Error> {
    let bytes = std::fs::read(file)?;
    Ok(digest(&bytes, algorithm, uppercase))
}

fn digest(bytes: &[u8], algorithm: Algorithm, uppercase: bool) -> String {
    let hash = match algorithm {
        Algorithm::Md5 => format!("{:x}", Md5::digest(bytes)),
        Algorithm::Sha1 => format!("{:x}", Sha1::digest(bytes)),
        Algorithm::Sha256 => format!("{:x}", Sha256::digest(bytes)),
        Algorithm::Sha384 => format!("{:x}", Sha384::digest(bytes)),
        Algorithm::Sha512 => format!("{:x}", Sha512::digest(bytes)),
        Algorithm::Sm3 => format!("{:x}", Sm3::digest(bytes)),
    };
    match uppercase {
        true => hash.to_uppercase(),
        false => hash,
    }
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
}
