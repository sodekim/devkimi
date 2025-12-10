use crate::command_error;

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn convert_json_to_yaml(json: &str) -> Result<String, Error> {
    let value = serde_json::from_str::<serde_json::Value>(json)?;
    serde_yaml::to_string(&value).map_err(Into::into)
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn convert_yaml_to_json(yaml: &str) -> Result<String, Error> {
    let value = serde_yaml::from_str::<serde_yaml::Value>(yaml)?;
    serde_json::to_string_pretty(&value).map_err(Into::into)
}

command_error! {
    (Json, "json error: {0}", #[from] serde_json::Error),
    (Yaml, "yaml error: {0}", #[from] serde_yaml::Error),
}
