use crate::command_error;
use serde::{Deserialize, Serialize};
use serde_json::{ser::PrettyFormatter, ser::Serializer, Value};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Indent {
    TwoSpace,
    FourSpace,
    Tab,
    None,
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub fn format_json(input: &str, indent: Indent, sortable: bool) -> Result<String, Error> {
    let mut value = serde_json::from_str::<Value>(input)?;
    if sortable {
        value.sort_all_objects();
    }
    match indent {
        Indent::None => serde_json::to_string(&value).map_err(Into::into),
        Indent::TwoSpace => to_string_pretty(&value, b"  "),
        Indent::FourSpace => to_string_pretty(&value, b"    "),
        Indent::Tab => to_string_pretty(&value, b"\t"),
    }
}

fn to_string_pretty(value: &Value, ident: &[u8]) -> Result<String, Error> {
    let formatter = PrettyFormatter::with_indent(ident);
    let mut writer = Vec::with_capacity(128);
    let mut serializer = Serializer::with_formatter(&mut writer, formatter);
    value.serialize(&mut serializer)?;
    String::from_utf8(writer).map_err(Into::into)
}

command_error! {
    (Json, "json error: {0}", #[from] serde_json::Error),
    (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}
