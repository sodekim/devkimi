use crate::command_error;
use font_kit::{error::SelectionError, source::SystemSource};

///
/// 获取系统的所有字体
///
#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn get_system_fonts() -> Result<Vec<String>, Error> {
    let source = SystemSource::new();
    let mut families = source.all_families()?;
    families.sort();
    Ok(families)
}

command_error! {
    (Font, "get system fonts error: {0}", #[from] SelectionError)
}
