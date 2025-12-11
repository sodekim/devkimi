use tauri::{AppHandle, Runtime};
use tracing::instrument;

#[tauri::command]
#[instrument(level = tracing::Level::DEBUG, skip(app), err(level = tracing::Level::ERROR))]
pub fn show_tray<R: Runtime>(app: AppHandle<R>) -> tauri::Result<()> {
    if let Some(tray) = app.tray_by_id("main") {
        tray.set_visible(true)?;
    }
    Ok(())
}

#[tauri::command]
#[instrument(skip(app), err(level = tracing::Level::ERROR))]
pub fn hide_tray<R: Runtime>(app: AppHandle<R>) -> tauri::Result<()> {
    if let Some(tray) = app.tray_by_id("main") {
        tray.set_visible(true)?;
    }
    Ok(())
}
