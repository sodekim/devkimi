use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Ord, PartialOrd, PartialEq, Eq, Serialize, Deserialize)]
pub enum Padding {
    Pkcs7,
    AnsiX923,
    Iso7816,
    Iso10126,
    Zero,
    None,
}
