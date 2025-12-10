use serde_json::Value;
use std::str::FromStr;
use tauri::{plugin::Plugin, Manager, Runtime};
use tracing::Level;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::fmt::format::FmtSpan;

#[derive(Default)]
pub struct TracingPlugin {
    worker_guard: Option<WorkerGuard>,
}

pub fn init() -> TracingPlugin {
    TracingPlugin::default()
}

impl<R: Runtime> Plugin<R> for TracingPlugin {
    fn name(&self) -> &'static str {
        "Tracing"
    }

    fn initialize(
        &mut self,
        app: &tauri::AppHandle<R>,
        _: serde_json::Value,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let data_dir = app.path().app_data_dir()?;
        let path = data_dir.join("store.json");
        let exists = std::fs::exists(&path)?;

        // 日志级别
        let level = match exists {
            true => {
                let bytes = std::fs::read(path)?;
                let value = serde_json::from_slice::<Value>(&bytes)?;
                value
                    .as_object()
                    .and_then(|store| store.get("settings"))
                    .and_then(|settings| settings.as_object())
                    .and_then(|settings| settings.get("debug"))
                    .and_then(|debug| debug.as_object())
                    .and_then(|debug| debug.get("level"))
                    .and_then(|level| level.as_str())
                    .and_then(|level| Level::from_str(level).ok())
                    .unwrap_or(Level::INFO)
            }
            false => Level::INFO,
        };

        // 写入到日志文件
        let logs = data_dir.join("logs");
        let file_name = "devkimi.log";
        let appender = tracing_appender::rolling::RollingFileAppender::new(
            tracing_appender::rolling::Rotation::DAILY,
            &logs,
            file_name,
        );
        let (wrapper, worker_guard) = tracing_appender::non_blocking(appender);
        self.worker_guard = Some(worker_guard);

        // 初始化
        tracing_subscriber::fmt()
            .with_ansi(false)
            .with_target(false)
            .with_file(true)
            .with_level(true)
            .with_max_level(level)
            .with_span_events(FmtSpan::NEW | FmtSpan::CLOSE)
            .with_thread_names(true)
            .with_line_number(true)
            .with_writer(wrapper)
            .init();
        Ok(())
    }
}
