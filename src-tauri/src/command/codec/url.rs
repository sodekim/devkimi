use crate::command_error;

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret)]
pub fn encode_url(input: &str) -> String {
    urlencoding::encode(input).into_owned()
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn decode_url(input: &str) -> Result<String, Error> {
    urlencoding::decode(input)
        .map(|v| v.into_owned())
        .map_err(|e| e.into())
}

command_error! {
    (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}
