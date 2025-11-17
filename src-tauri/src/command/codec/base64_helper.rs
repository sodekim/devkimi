use base64::prelude::{
    BASE64_STANDARD, BASE64_STANDARD_NO_PAD, BASE64_URL_SAFE, BASE64_URL_SAFE_NO_PAD,
};
use base64::Engine;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Base64Mode {
    Standard,
    StandardNoPad,
    UrlSafe,
    UrlSafeNoPad,
}

impl Base64Mode {
    #[inline]
    pub fn encode(&self, bytes: &[u8]) -> String {
        match self {
            Base64Mode::Standard => BASE64_STANDARD.encode(bytes),
            Base64Mode::StandardNoPad => BASE64_STANDARD_NO_PAD.encode(bytes),
            Base64Mode::UrlSafe => BASE64_URL_SAFE.encode(bytes),
            Base64Mode::UrlSafeNoPad => BASE64_URL_SAFE_NO_PAD.encode(bytes),
        }
    }

    #[inline]
    pub fn decode(&self, base64: &str) -> Result<Vec<u8>, base64::DecodeError> {
        match self {
            Base64Mode::Standard => BASE64_STANDARD.decode(base64),
            Base64Mode::StandardNoPad => BASE64_STANDARD_NO_PAD.decode(base64),
            Base64Mode::UrlSafe => BASE64_URL_SAFE.decode(base64),
            Base64Mode::UrlSafeNoPad => BASE64_URL_SAFE_NO_PAD.decode(base64),
        }
    }
}
