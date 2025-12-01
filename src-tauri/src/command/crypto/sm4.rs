use md5::digest::KeyInit;
use serde::{Deserialize, Serialize};
use sm4::Sm4;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Mode {
    CBC,
    CFB,
    OFB,
    CTR,
    ECB,
}

pub fn sm4_encrypt(key: &str, text: &str, mode: Mode) -> Result<String, Error> {
    let sm4 = Sm4::new(key.as_bytes());
}
