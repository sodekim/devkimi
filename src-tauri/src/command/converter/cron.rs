use crate::command_error;
use chrono::{format::StrftimeItems, Local};
use cron::Schedule;
use std::str::FromStr;

#[tauri::command]
pub fn parse_cron(cron: &str, pattern: &str, size: usize) -> Result<Vec<String>, Error> {
    let items = StrftimeItems::new(pattern).parse()?;
    let schedule = Schedule::from_str(cron)?;
    let times = schedule
        .after(&Local::now())
        .take(size)
        .map(|time| time.format_with_items(items.iter()).to_string())
        .collect::<Vec<_>>();
    Ok(times)
}

command_error! {
    (Cron, "cron error: {0}", #[from] cron::error::Error),
    (Pattern, "pattern error: {0}", #[from] chrono::format::ParseError),
}
