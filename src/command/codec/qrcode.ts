import { invoke } from "@tauri-apps/api/core";

const encodeQrCode = async (text: string) => {
  return invoke<[string, string]>("encode_qrcode", { text });
};

const decodeQrCode = async (image: string) => {
  return invoke<string>("decode_qrcode", { image });
};

export { encodeQrCode, decodeQrCode };
