use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Ord, PartialOrd, PartialEq, Eq, Serialize, Deserialize)]
pub enum BlockMode {
    Cbc,
    Cfb,
    Ecb,
    Ofb,
    Ctr,
}
