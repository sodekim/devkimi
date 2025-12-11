mod command;
mod encoding;
mod error;
mod plugin;
mod runnable;
mod util;

use runnable::Runnable;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(plugin::tracing::init())
        .plugin(plugin::tray::init())
        .plugin(plugin::clear_temp::init())
        .with_handler()
        .run_with_default_context()
        .expect("error while running tauri application");
}
