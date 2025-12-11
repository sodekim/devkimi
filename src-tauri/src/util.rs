use std::path::PathBuf;

use tauri::{AppHandle, Manager, Runtime};

pub fn get_app_temp_dir<R: Runtime>(app: &AppHandle<R>, create: bool) -> tauri::Result<PathBuf> {
    let data_dir = app.path().app_data_dir()?;
    let temp_dir = data_dir.join("temp");
    if create && !temp_dir.exists() {
        std::fs::create_dir_all(&temp_dir)?;
    }
    Ok(temp_dir)
}
