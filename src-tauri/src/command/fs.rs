use crate::command_error;
use std::path::PathBuf;
use tracing::instrument;

///
/// 使用系统应用打开文件
///
#[instrument]
#[tauri::command(async)]
pub fn open_file(path: &str) -> Result<(), Error> {
    open::that(path).map_err(Into::into)
}

///
/// 复制文件,如果目标路径是目录,这复制文件到目录中
///
#[instrument]
#[tauri::command(async)]
pub fn copy_file(from: &str, to: &str) -> Result<(), Error> {
    let from = PathBuf::from(from);
    let mut to = PathBuf::from(to);
    if to.is_dir() {
        let file_name = from
            .file_name()
            .and_then(|file_name| file_name.to_str())
            .ok_or_else(|| Error::InvalidFileName(from.display().to_string()))?;
        to.push(file_name);
    }
    std::fs::copy(from, to).map(|_| ()).map_err(Into::into)
}

command_error! {
    (Io, "io error: {0}", #[from] std::io::Error),
    (InvalidFileName, "invalid file name: {0}", String),
}

#[cfg(test)]
mod test {

    #[test]
    fn open_dir() {
        open::that("C:/").unwrap();
    }
}
