import { invoke } from "@tauri-apps/api/core";

const generateUuid = (
  size: number,
  version: string,
  hyphen: boolean,
  uppercase: boolean,
) => {
  return invoke<string[]>("generate_uuid", {
    size,
    version,
    hyphen,
    uppercase,
  });
};

export { generateUuid };
