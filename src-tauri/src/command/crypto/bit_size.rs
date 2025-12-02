use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum BitSize {
    Bits128,
    Bits192,
    Bits256,
}
