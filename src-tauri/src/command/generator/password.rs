use rand::Rng;

const NUMERIC_CHARS: &str = "0123456789";
const LOWERCASE_CHARS: &str = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPECIAL_CHARS: &str = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret)]
pub fn generate_password(
    size: u16,
    length: u16,
    uppercase: bool,
    lowercase: bool,
    numeric: bool,
    special: bool,
    excludes: &str,
) -> Vec<String> {
    fn random(length: u16, chars: &[char]) -> String {
        let mut password = String::with_capacity(length as usize);
        for _ in 0..length {
            let c = chars
                .get(rand::thread_rng().gen_range(0..chars.len()))
                .unwrap();
            password.push(*c);
        }
        password
    }

    let mut chars = String::with_capacity(
        UPPERCASE_CHARS.len() + LOWERCASE_CHARS.len() + NUMERIC_CHARS.len() + SPECIAL_CHARS.len(),
    );
    if uppercase {
        chars.push_str(UPPERCASE_CHARS);
    }
    if lowercase {
        chars.push_str(LOWERCASE_CHARS);
    }
    if numeric {
        chars.push_str(NUMERIC_CHARS);
    }
    if special {
        chars.push_str(SPECIAL_CHARS);
    }
    chars.retain(|c| !excludes.contains(c));

    // 字符为空
    if chars.is_empty() {
        return vec![];
    }

    let chars = chars.chars().collect::<Vec<_>>();
    let mut passwords = Vec::with_capacity(size as usize);
    for _ in 0..size {
        passwords.push(random(length, &chars));
    }

    passwords
}
