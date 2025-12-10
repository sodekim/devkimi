thread_local! {
    static OPTIONS: markdown::Options = {
        let mut options = markdown::Options::gfm();
        options.compile.allow_dangerous_html = true;
        options
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn parse_markdown(markdown: &str) -> Result<String, String> {
    OPTIONS
        .with(|options| markdown::to_html_with_options(markdown, &options))
        .map_err(|e| e.to_string())
}
