use tauri::{Manager, Runtime};

#[tauri::command]
pub fn open_devtools<R: Runtime>(app: tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        window.open_devtools();
    }
}
