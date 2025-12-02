mod command;
mod encoding;
mod error;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            command::fs::open_file,
            command::fs::copy_file,
            command::font::get_system_fonts,
            command::formatter::json::format_json,
            command::formatter::xml::format_xml,
            command::formatter::sql::format_sql,
            command::generator::uuid::generate_uuid,
            command::generator::password::generate_password,
            command::generator::hash::generate_text_hash,
            command::generator::hash::generate_file_hash,
            command::codec::base64_text::encode_text_base64,
            command::codec::base64_text::decode_text_base64,
            command::codec::base64_image::encode_image_base64,
            command::codec::base64_image::decode_image_base64,
            command::codec::gzip::encode_gzip,
            command::codec::gzip::decode_gzip,
            command::codec::url::encode_url,
            command::codec::url::decode_url,
            command::codec::qrcode::encode_qrcode,
            command::codec::qrcode::decode_qrcode,
            command::text::markdown::parse_markdown,
            command::text::regex::parse_regex,
            command::text::jsonpath::parse_jsonpath,
            command::converter::cron::parse_cron,
            command::converter::json_yaml::convert_json_to_yaml,
            command::converter::json_yaml::convert_yaml_to_json,
            command::converter::yaml_properties::convert_yaml_to_properties,
            command::converter::yaml_properties::convert_properties_to_yaml,
            command::crypto::rsa::generate_rsa_key_pair,
            command::crypto::rsa::encrypt_rsa,
            command::crypto::rsa::decrypt_rsa,
            command::crypto::sm4::encrypt_sm4,
            command::crypto::sm4::decrypt_sm4,
            command::crypto::sm4::generate_sm4_key,
            command::crypto::sm4::generate_sm4_iv,
            command::crypto::aes::encrypt_aes,
            command::crypto::aes::decrypt_aes,
            command::crypto::aes::generate_aes_key,
            command::crypto::aes::generate_aes_iv,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
