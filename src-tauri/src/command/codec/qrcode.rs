use crate::command_error;
use image::{ImageError, Luma};
use qrcode::{types::QrError, QrCode};
use std::path::PathBuf;
use uuid::Uuid;

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn encode_qrcode(text: &str) -> Result<PathBuf, Error> {
    let code = QrCode::new(text)?;
    let image = code.render::<Luma<u8>>().build();
    let tempdir = tempfile::tempdir()?.keep();
    let filename = format!("{}.png", Uuid::new_v4().simple());
    let tempfile = tempdir.join(filename);
    image.save_with_format(&tempfile, image::ImageFormat::Png)?;
    Ok(tempfile)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn decode_qrcode(image: &str) -> Result<String, Error> {
    let image = image::open(image)?.into_luma8();
    let mut decoder = quircs::Quirc::default();
    let codes = decoder.identify(image.width() as usize, image.height() as usize, &image);
    let mut value = String::default();
    for code in codes {
        let code = code?;
        let data = code.decode()?;
        value.push_str(&String::from_utf8(data.payload)?);
    }
    Ok(value)
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
    (QrCode, "qrcode error: {0}", #[from] QrError),
    (Image, "image error: {0}", #[from] ImageError),
    (Extract, "qrcode extract error: {0}", #[from] quircs::ExtractError),
    (Decode, "qrcode decode error: {0}", #[from] quircs::DecodeError),
    (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}
