#[tauri::command]
pub fn encode_html(input: &str) -> String {
    html_escape::encode_text(input).to_string()
}

#[tauri::command]
pub fn decode_html(input: &str) -> String {
    html_escape::decode_html_entities(input).to_string()
}
