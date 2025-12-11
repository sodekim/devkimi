use tauri::{
    menu::{Menu, MenuItem},
    plugin::{PluginApi, TauriPlugin},
    tray::{TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Runtime,
};
use tracing::{debug, error};

fn setup<R: Runtime>(
    app: &AppHandle<R>,
    _: PluginApi<R, ()>,
) -> Result<(), Box<dyn std::error::Error>> {
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit])?;
    let tray = TrayIconBuilder::with_id("main")
        .icon(app.default_window_icon().cloned().unwrap())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| {
            debug!("Tray icon event: {:?}", event);
            if matches!(event, TrayIconEvent::Click { .. }) {
                if let Some(window) = tray.app_handle().get_webview_window("main") {
                    match window.show() {
                        Ok(_) => {
                            // 隐藏托盘
                            if let Err(e) = tray.set_visible(false) {
                                error!("Error hiding tray: {}", e);
                            }
                        }
                        Err(e) => {
                            error!("Error showing window: {}", e);
                        }
                    }
                }
            }
        })
        .on_menu_event(|app, event| {
            debug!("Tray menu event: {:?}", event);
            if event.id() == "quit" {
                app.exit(0);
            }
        })
        .build(app)?;

    tray.set_visible(false)?;
    Ok(())
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("devkimi-tray")
        .setup(setup)
        .build()
}
