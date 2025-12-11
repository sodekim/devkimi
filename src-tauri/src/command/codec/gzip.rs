use std::io::{Read, Write};

use base64::{prelude::BASE64_STANDARD, Engine};
use flate2::Compression;
use serde::{Deserialize, Serialize};

use crate::command_error;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Output {
    value: String,
    ratio: f32,
}

impl Output {
    pub fn new(value: String, input_size: i64, output_size: i64) -> Self {
        let ratio = (input_size - output_size) as f32 / input_size as f32;
        Self { value, ratio }
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn encode_gzip(input: &str, level: u32) -> Result<Output, Error> {
    let mut encoder = flate2::write::GzEncoder::new(Vec::new(), Compression::new(level));
    let bytes = input.as_bytes();
    let input_size = bytes.len();
    encoder.write_all(bytes)?;
    let bytes = encoder.finish()?;
    let value = BASE64_STANDARD.encode(bytes);
    let output_size = value.as_bytes().len();
    Ok(Output::new(value, input_size as i64, output_size as i64))
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn decode_gzip(input: &str) -> Result<Output, Error> {
    let output_size = input.as_bytes().len();
    let bytes = BASE64_STANDARD.decode(input)?;
    let mut decoder = flate2::read::GzDecoder::new(bytes.as_slice());
    let mut value = String::new();
    let input_size = decoder.read_to_string(&mut value)?;
    Ok(Output::new(value, input_size as i64, output_size as i64))
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
    (Base64Decode, "base64 decode error: {0}", #[from] base64::DecodeError),
}
