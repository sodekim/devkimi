use super::base64_helper::Base64Mode;
use crate::command_error;
use image::ImageReader;
use std::{fs::read, io::Cursor};

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn encode_image_base64(image: &str, mode: Base64Mode) -> Result<String, Error> {
    let bytes = read(image)?;
    Ok(mode.encode(&bytes))
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn decode_image_base64(base64: String, mode: Base64Mode) -> Result<(String, String), Error> {
    let bytes = mode.decode(&base64)?;
    let image = ImageReader::new(Cursor::new(&bytes)).with_guessed_format()?;
    let format = image.format().ok_or_else(|| Error::UnknowImageFormat)?;
    let extension = format.extensions_str()[0];
    Ok((base64, extension.to_string()))
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
    (DecodeBase64, "decode base64 error: {0}", #[from] base64::DecodeError),
    (Image, "image error: {0}", #[from] image::ImageError),
    (UnknowImageFormat, "unsupported image format"),
    (Runtime, "runtime error: {0}", #[from] tauri::Error),
}
