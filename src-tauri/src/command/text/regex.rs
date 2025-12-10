use crate::serialize_error;
use regex::RegexBuilder;
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Regex(#[from] regex::Error),
}

serialize_error!(Error);

pub type Captures = Vec<Match>;

#[derive(Debug, Serialize)]
pub struct Match {
    start: usize,
    end: usize,
    value: String,
}

impl<'a> From<regex::Match<'a>> for Match {
    fn from(value: regex::Match<'a>) -> Self {
        Self {
            start: value.start(),
            end: value.end(),
            value: value.as_str().to_string(),
        }
    }
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::WARN))]
pub fn parse_regex(
    text: &str,
    pattern: &str,
    global: bool,
    multi_line: bool,
    case_insensitive: bool,
    unicode: bool,
) -> Result<Vec<Captures>, Error> {
    let regex = RegexBuilder::new(pattern)
        .case_insensitive(case_insensitive)
        .multi_line(multi_line)
        .unicode(unicode)
        .build()?;

    fn captures<'h>(captures: regex::Captures<'h>) -> Captures {
        captures
            .iter()
            .flatten()
            .map(Match::from)
            .collect::<Vec<_>>()
    }

    if global {
        Ok(regex.captures_iter(text).map(captures).collect())
    } else {
        Ok(regex.captures(text).into_iter().map(captures).collect())
    }
}
