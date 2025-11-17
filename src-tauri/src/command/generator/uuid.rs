use serde::{Deserialize, Serialize};
use uuid::{Context, Timestamp, Uuid};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Version {
    V1,
    V4,
    V7,
}

#[tauri::command]
pub fn generate_uuid(size: u16, version: Version, uppercase: bool, hyphen: bool) -> Vec<String> {
    let mut uuids = Vec::with_capacity(size as usize);
    for _ in 0..size {
        let uuid = match version {
            Version::V1 => new_v1(),
            Version::V4 => new_v4(),
            Version::V7 => new_v7(),
        };
        let mut uuid = if hyphen {
            uuid.hyphenated().to_string()
        } else {
            uuid.simple().to_string()
        };
        if uppercase {
            uuid = uuid.to_uppercase();
        };
        uuids.push(uuid);
    }
    uuids
}

fn new_v1() -> Uuid {
    let context = Context::new_random();
    let timestamp = Timestamp::now(context);
    Uuid::new_v1(timestamp, &[0, 0, 0, 0, 0, 0])
}

fn new_v4() -> Uuid {
    Uuid::new_v4()
}

fn new_v7() -> Uuid {
    let context = Context::new_random();
    let timestamp = Timestamp::now(context);
    Uuid::new_v7(timestamp)
}
