use crate::command_error;
use font_kit::{error::SelectionError, source::SystemSource};

///
/// 获取系统的所有字体
///
#[tauri::command]
pub fn get_system_fonts() -> Result<Vec<String>, Error> {
    let source = SystemSource::new();
    let mut families = source.all_families()?;
    families.sort();
    Ok(families)
}

command_error! {
    (Font, "get system fonts error: {0}", #[from] SelectionError)
}

#[cfg(test)]
mod test {
    use crate::command::font::get_system_fonts;

    #[test]
    fn test_get_system_fonts() {
        let fonts = get_system_fonts().unwrap();
        println!("{:?}", fonts);
    }
}
