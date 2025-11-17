import { invoke } from "@tauri-apps/api/core";

const encodeImageBase64 = async (image: string, mode: string) => {
  return invoke("encode_image_base64", { image, mode });
};

const decodeImageBase64 = async (base64: string, mode: string) => {
  return invoke("decode_image_base64", { base64, mode });
};

export { encodeImageBase64, decodeImageBase64 };
