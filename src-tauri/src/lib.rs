mod command;
mod encoding;
mod error;
mod ext;
mod tracing;

use crate::ext::TauriBuilderExt;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Builder, Wry,
};

pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tracing::init())
        .with_handler()
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;
            let _ = TrayIconBuilder::new()
                .icon(app.default_window_icon().cloned().unwrap())
                .menu(&menu)
                .build(app)?;
            Ok(())
        });
    <Builder<Wry> as TauriBuilderExt>::run(builder).expect("error while running tauri application");
}
