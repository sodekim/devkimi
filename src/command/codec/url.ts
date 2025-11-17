import { invoke } from "@tauri-apps/api/core";

const encodeURL = async (input: string) => {
  return invoke<string>("encode_url", { input });
};

const decodeURL = async (input: string) => {
  return invoke<string>("decode_url", { input });
};

export { encodeURL, decodeURL };
