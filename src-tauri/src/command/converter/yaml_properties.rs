use crate::command_error;
use regex::Regex;
use serde_yaml::{Mapping, Value};
use std::collections::{BTreeMap, HashMap};

type Properties = BTreeMap<String, String>;

#[tauri::command]
pub fn convert_yaml_to_properties(yaml: &str) -> Result<String, Error> {
    yaml_to_properties(yaml).map(|properties| serialize_properties(&properties))
}

#[tauri::command]
pub fn convert_properties_to_yaml(properties: &str) -> Result<String, Error> {
    let properties = deserialize_properties(properties);
    let value = properties_to_yaml(properties);
    serde_yaml::to_string(&value).map_err(Into::into)
}

fn yaml_to_properties(yaml: &str) -> Result<Properties, Error> {
    fn insert(key: String, value: Value, properties: &mut Properties) -> Result<(), Error> {
        match value {
            Value::Null => {
                properties.insert(key, "".to_string());
            }
            Value::Bool(value) => {
                properties.insert(key, format!("{}", value));
            }
            Value::Number(value) => {
                properties.insert(key, format!("{}", value));
            }
            Value::String(value) => {
                properties.insert(key, value);
            }
            Value::Sequence(values) => {
                for (index, value) in values.into_iter().enumerate() {
                    insert(format!("{}[{}]", key, index), value, properties)?;
                }
            }
            Value::Mapping(mapping) => {
                for (suffix, value) in mapping.into_iter() {
                    if let Some(suffix) = suffix.as_str() {
                        insert(format!("{}.{}", key, suffix), value, properties)?;
                    } else {
                        return Err(Error::KeyNotString(format!("{}.{:?}", key, suffix)));
                    }
                }
            }
            Value::Tagged(_) => return Err(Error::ContainsTaggedValue(key)),
        }
        Ok(())
    }

    let mut properties = Properties::new();
    let value: HashMap<String, Value> = serde_yaml::from_str(yaml)?;
    value
        .into_iter()
        .try_for_each(|(key, value)| insert(key, value, &mut properties))?;
    Ok(properties)
}

fn parse_key(key: &str) -> Result<Vec<String>, String> {
    let re = Regex::new(r#"([^\[\].]+)|\[(\d+)\]"#).unwrap();
    let mut parts = Vec::new();
    for cap in re.captures_iter(key) {
        if let Some(field) = cap.get(1) {
            parts.push(field.as_str().to_string());
        } else if let Some(idx) = cap.get(2) {
            parts.push(format!("[{}]", idx.as_str()));
        }
    }
    if parts.is_empty() {
        Err("Empty key".to_string())
    } else {
        Ok(parts)
    }
}

fn parse_value(s: &str) -> Value {
    if s.eq_ignore_ascii_case("true") {
        return Value::Bool(true);
    }
    if s.eq_ignore_ascii_case("false") {
        return Value::Bool(false);
    }
    if let Ok(i) = s.parse::<i64>() {
        return Value::Number(i.into());
    }
    if let Ok(f) = s.parse::<f64>() {
        if f.is_finite() {
            return Value::Number(serde_yaml::Number::from(f));
        }
    }
    Value::String(s.to_string())
}

pub fn properties_to_yaml(properties: Properties) -> Result<Value, String> {
    let mut root = Value::Mapping(Mapping::new());

    let mut entries: Vec<(Vec<String>, Value)> = Vec::new();
    for (key, val) in properties {
        entries.push((parse_key(&key)?, parse_value(&val)));
    }
    entries.sort_by(|a, b| a.0.cmp(&b.0));

    for (parts, value) in entries {
        insert_value(&mut root, &parts, value)?;
    }

    Ok(root)
}

fn insert_value(root: &mut Value, path: &[String], value: Value) -> Result<(), String> {
    let mut current = root;

    for (i, part) in path.iter().enumerate() {
        let is_last = i == path.len() - 1;

        if part.starts_with('[') && part.ends_with(']') {
            let idx_str = &part[1..part.len() - 1];
            let idx = idx_str
                .parse::<usize>()
                .map_err(|_| format!("Invalid array index: {}", part))?;

            // 如果 current 不是序列，则创建一个新的序列
            if !current.is_sequence() {
                *current = Value::Sequence(Vec::new());
            }

            // 获取序列的可变引用
            let seq = current
                .as_sequence_mut()
                .ok_or("Expected a sequence (array)")?;

            // 扩展数组以确保索引位置存在
            while seq.len() <= idx {
                if is_last {
                    seq.push(Value::Null);
                } else {
                    seq.push(Value::Mapping(Mapping::new()));
                }
            }

            if is_last {
                seq[idx] = value;
                return Ok(());
            } else {
                current = &mut seq[idx];
            }
        } else {
            // 确保 current 是 Mapping 类型
            if !current.is_mapping() {
                *current = Value::Mapping(Mapping::new());
            }

            let map = current
                .as_mapping_mut()
                .ok_or("Expected a mapping (object)")?;

            if is_last {
                map.insert(Value::String(part.clone()), value);
                return Ok(());
            } else {
                // 如果键不存在，插入一个新的 Mapping
                if !map.contains_key(&Value::String(part.clone())) {
                    map.insert(Value::String(part.clone()), Value::Mapping(Mapping::new()));
                }
                // 更新 current 为该键对应的值
                current = map.get_mut(&Value::String(part.clone())).unwrap();
            }
        }
    }

    Ok(())
}

fn serialize_properties(properties: &Properties) -> String {
    properties
        .iter()
        .map(|(key, value)| format!("{}={}", key, value))
        .collect::<Vec<_>>()
        .join("\n")
}

fn deserialize_properties(value: &str) -> Properties {
    value
        .lines()
        .filter(|line| !line.is_empty())
        .filter(|line| !line.starts_with("#"))
        .flat_map(|line| line.split_once("="))
        .map(|(key, value)| (key.to_string(), value.to_string()))
        .collect::<Properties>()
}

command_error! {
    (Yaml, "yaml error: {0}", #[from]  serde_yaml::Error),
    (ContainsTaggedValue, "unsupported yaml tagged value: {0}", String),
    (KeyNotString, "unsupported yaml key is not string: {0}", String),
}
