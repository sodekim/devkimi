use crate::{command_error, util::get_app_temp_dir};
use base64::{prelude::BASE64_STANDARD, Engine};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};
use tracing::instrument;
use uuid::Uuid;

///
/// 使用系统应用打开图片
///
#[tauri::command]
#[instrument(level = tracing::Level::DEBUG, skip(app), err(level = tracing::Level::ERROR))]
pub fn open_base64_image<R: Runtime>(
    base64: &str,
    extension: &str,
    app: AppHandle<R>,
) -> Result<(), Error> {
    let temp_dir = get_app_temp_dir(&app, true)?;
    let temp_file = temp_dir.join(format!("{}.{}", Uuid::new_v4(), extension));
    let bytes = BASE64_STANDARD.decode(base64)?;
    std::fs::write(&temp_file, bytes)?;
    open::that_in_background(&temp_file);
    Ok(())
}

///
/// 保存图片
///
#[tauri::command]
#[instrument(level = tracing::Level::DEBUG, err(level = tracing::Level::ERROR))]
pub fn save_base64_image(base64: &str, extension: &str, dir: &str) -> Result<(), Error> {
    let dir = PathBuf::from(dir);
    let temp_file = dir.join(format!("{}.{}", Uuid::new_v4(), extension));
    let bytes = BASE64_STANDARD.decode(base64)?;
    std::fs::write(&temp_file, bytes)?;
    Ok(())
}

///
/// 使用系统应用打开文件
///
#[tauri::command]
#[instrument(level = tracing::Level::DEBUG, err(level = tracing::Level::ERROR))]
pub fn open_file(path: &str) -> Result<(), Error> {
    open::that_in_background(path);
    Ok(())
}

///
/// 打开日志目录
///
#[tauri::command]
#[instrument(level = tracing::Level::DEBUG, skip(app), err(level = tracing::Level::ERROR))]
pub fn open_log_dir<R: Runtime>(app: AppHandle<R>) -> Result<(), Error> {
    let log_dir = app.path().app_log_dir()?;
    open::that_in_background(log_dir);
    Ok(())
}

///
/// 复制文件,如果目标路径是目录,这复制文件到目录中
///
#[tauri::command(async)]
#[instrument(level = tracing::Level::DEBUG, err(level = tracing::Level::ERROR))]
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
    (Runtime, "runtime error: {0}", #[from] tauri::Error),
    (DecodeBase64, "decode base64 error: {0}", #[from] base64::DecodeError)
}
