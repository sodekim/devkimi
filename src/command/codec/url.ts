import { invoke } from "@tauri-apps/api/core";

const encodeURL = (input: string) => {
  return invoke<string>("encode_url", { input });
};

const decodeURL = (input: string) => {
  return invoke<string>("decode_url", { input });
};

export { encodeURL, decodeURL };
