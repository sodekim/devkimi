use serde::{Deserialize, Serialize};
use sqlformat::{format, FormatOptions, QueryParams};

#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
pub enum Indent {
    TwoSpace,
    FourSpace,
    Tab,
}

#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
pub enum Dialect {
    Generic,
    PostgreSql,
    SQLServer,
}

#[tauri::command]
pub fn format_sql(input: &str, indent: Indent, dialect: Dialect, uppercase: bool) -> String {
    let options = FormatOptions {
        indent: match indent {
            Indent::TwoSpace => sqlformat::Indent::Spaces(2),
            Indent::FourSpace => sqlformat::Indent::Spaces(4),
            Indent::Tab => sqlformat::Indent::Tabs,
        },
        dialect: match dialect {
            Dialect::Generic => sqlformat::Dialect::Generic,
            Dialect::PostgreSql => sqlformat::Dialect::PostgreSql,
            Dialect::SQLServer => sqlformat::Dialect::SQLServer,
        },
        uppercase: Some(uppercase),
        ..Default::default()
    };
    format(input, &QueryParams::None, &options)
}
