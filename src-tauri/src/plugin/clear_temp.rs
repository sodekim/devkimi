use crate::util::get_app_temp_dir;
use tauri::{
    plugin::{Builder, TauriPlugin},
    RunEvent, Runtime,
};
use tracing::error;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("devkimi-clear-temp")
        .on_event(|app, event| {
            if matches!(event, RunEvent::Exit) {
                match get_app_temp_dir(app, false) {
                    Ok(temp_dir) => {
                        if temp_dir.exists() {
                            if let Err(e) = std::fs::remove_dir_all(&temp_dir) {
                                error!("Failed to remove app temp dir: {}", e);
                            }
                        }
                    }
                    Err(e) => error!("Failed to get app temp dir: {}", e),
                }
            }
        })
        .build()
}
