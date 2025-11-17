import { invoke } from "@tauri-apps/api/core";

const encodeGZip = (input: string, level: number) => {
  return invoke<{
    value: string;
    ratio: number;
  }>("encode_gzip", { input, level });
};

const decodeGZip = (input: string, level: number) => {
  return invoke<{
    value: string;
    ratio: number;
  }>("decode_gzip", { input, level });
};

export { encodeGZip, decodeGZip };
