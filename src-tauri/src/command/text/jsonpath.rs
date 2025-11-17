use jsonpath_rust::{parser::errors::JsonPathError, query::js_path};
use serde_json::Value;

use crate::command_error;

#[tauri::command]
pub fn parse_jsonpath(text: &str, pattern: &str) -> Result<String, Error> {
    let value = serde_json::from_str::<Value>(text)?;
    let refs = js_path(&pattern, &value)?;
    let values = refs.into_iter().map(|r| r.val()).collect::<Vec<_>>();
    let output = serde_json::to_string_pretty(&values)?;
    Ok(output)
}

command_error! {
    (Json, "parse json error: {0}", #[from] serde_json::Error),
    (JsonPath, "parse json path error: {0}", #[from] JsonPathError),
}
