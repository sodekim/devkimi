use crate::command_error;
use base64::{prelude::BASE64_STANDARD, Engine};
use image::{codecs::png::PngEncoder, ImageError, Luma};
use qrcode::{types::QrError, QrCode};

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn encode_qrcode(text: &str) -> Result<(String, String), Error> {
    let code = QrCode::new(text)?;
    let image = code.render::<Luma<u8>>().build();
    let mut bytes = Vec::with_capacity(image.len());
    let encoder = PngEncoder::new(&mut bytes);
    image.write_with_encoder(encoder)?;
    let base64 = BASE64_STANDARD.encode(&bytes);
    Ok((base64, "png".to_string()))
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
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
    (Runtime, "runtime error: {0}", #[from] tauri::Error)
}
