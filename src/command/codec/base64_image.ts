import { invoke } from "@tauri-apps/api/core";

const encodeImageBase64 = (image: string, mode: string) => {
  return invoke<string>("encode_image_base64", { image, mode });
};

const decodeImageBase64 = (base64: string, mode: string) => {
  return invoke<[string, string]>("decode_image_base64", { base64, mode });
};

export { encodeImageBase64, decodeImageBase64 };
