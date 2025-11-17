use super::base64_helper::Base64Mode;
use crate::command_error;
use image::ImageReader;
use std::{fs::read, io::Cursor, path::PathBuf};
use uuid::Uuid;

#[tauri::command]
pub fn encode_image_base64(image: &str, mode: Base64Mode) -> Result<String, Error> {
    let bytes = read(image)?;
    Ok(mode.encode(&bytes))
}

#[tauri::command]
pub fn decode_image_base64(base64: &str, mode: Base64Mode) -> Result<PathBuf, Error> {
    let bytes = mode.decode(base64)?;
    let image = ImageReader::new(Cursor::new(&bytes)).with_guessed_format()?;
    let format = image.format().ok_or_else(|| Error::UnknowImageFormat)?;
    let tempdir = tempfile::tempdir().map(|f| f.keep())?;
    let filename = format!("{}.{}", Uuid::new_v4().simple(), format.extensions_str()[0]);
    let tempfile = tempdir.join(filename);
    std::fs::write(&tempfile, &bytes)?;
    Ok(tempfile)
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
    (DecodeBase64, "decode base64 error: {0}", #[from] base64::DecodeError),
    (Image, "image error: {0}", #[from] image::ImageError),
    (UnknowImageFormat, "unsupported image format")
}
