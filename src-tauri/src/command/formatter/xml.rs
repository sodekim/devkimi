use crate::command_error;
use quick_xml::{events::Event, Writer};
use serde::{Deserialize, Serialize};
use std::io::Cursor;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Indent {
    TwoSpace,
    FourSpace,
    Tab,
    None,
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn format_xml(input: &str, indent: Indent) -> Result<String, Error> {
    let cursor = Cursor::new(Vec::with_capacity(128));
    let mut writer = match indent {
        Indent::TwoSpace => Writer::new_with_indent(cursor, ' ' as u8, 2),
        Indent::FourSpace => Writer::new_with_indent(cursor, ' ' as u8, 4),
        Indent::Tab => Writer::new_with_indent(cursor, '\t' as u8, 1),
        Indent::None => Writer::new(cursor),
    };
    let mut reader = quick_xml::Reader::from_str(input);
    reader.config_mut().trim_text(true);
    loop {
        let event = reader.read_event()?;
        match event {
            Event::Eof => break,
            event => {
                writer.write_event(event)?;
            }
        }
    }
    let bytes = writer.into_inner().into_inner();
    String::from_utf8(bytes).map_err(Into::into)
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
    (Xml, "xml error: {0}", #[from] quick_xml::Error),
    (Utf8, "utf8 error: {0}", #[from] std::string::FromUtf8Error),
}
