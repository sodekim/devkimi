import { invoke } from "@tauri-apps/api/core";

const encodeTextBase64 = async (text: string, mode: string) => {
  return invoke<string>("encode_text_base64", {
    text,
    mode,
  });
};

const decodeTextBase64 = async (base64: string, mode: string) => {
  return invoke<string>("decode_text_base64", {
    base64,
    mode,
  });
};

export { encodeTextBase64, decodeTextBase64 };
