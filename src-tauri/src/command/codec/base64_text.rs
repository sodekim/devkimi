use std::string::FromUtf8Error;

use crate::command_error;

use super::base64_helper::Base64Mode;

#[tauri::command]
pub fn encode_text_base64(text: &str, mode: Base64Mode) -> Result<String, Error> {
    Ok(mode.encode(text.as_bytes()))
}

#[tauri::command]
pub fn decode_text_base64(base64: &str, mode: Base64Mode) -> Result<String, Error> {
    let bytes = mode.decode(base64)?;
    String::from_utf8(bytes).map_err(Into::into)
}

command_error! {
    (Utf8, "utf-8 error: {0}", #[from] FromUtf8Error),
    (DecodeBase64, "decode base64 error: {0}", #[from] base64::DecodeError),
}
