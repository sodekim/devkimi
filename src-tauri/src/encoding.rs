use base64::prelude::BASE64_STANDARD;
use base64::Engine;
use hex::FromHexError;
use serde::{Deserialize, Serialize};
use std::string::FromUtf8Error;

#[derive(Debug, Copy, Clone, Ord, PartialOrd, Eq, PartialEq, Hash, Serialize, Deserialize)]
pub enum Encoding {
    Utf8,
    Hex,
    Base64,
}

#[derive(Debug, thiserror::Error)]
pub enum EncodingError {
    #[error(transparent)]
    FromUtf8(#[from] FromUtf8Error),
    #[error(transparent)]
    FromHex(#[from] FromHexError),
    #[error(transparent)]
    DecodeBase64(#[from] base64::DecodeError),
}

impl Encoding {
    pub fn encode(self, value: &[u8]) -> Result<String, EncodingError> {
        match self {
            Encoding::Utf8 => String::from_utf8(value.to_vec()).map_err(Into::into),
            Encoding::Hex => Ok(hex::encode(value)),
            Encoding::Base64 => Ok(BASE64_STANDARD.encode(value)),
        }
    }

    pub fn decode(self, value: &str) -> Result<Vec<u8>, EncodingError> {
        match self {
            Encoding::Utf8 => Ok(value.as_bytes().to_vec()),
            Encoding::Hex => hex::decode(value).map_err(Into::into),
            Encoding::Base64 => BASE64_STANDARD.decode(value).map_err(Into::into),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EncodingText {
    pub text: String,
    pub encoding: Encoding,
}

impl EncodingText {
    pub fn new(value: impl Into<String>, encoding: Encoding) -> Self {
        Self {
            text: value.into(),
            encoding,
        }
    }

    pub fn to_bytes(self) -> Result<Vec<u8>, EncodingError> {
        self.encoding.decode(&self.text)
    }
}
