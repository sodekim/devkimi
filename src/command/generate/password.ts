import { invoke } from "@tauri-apps/api/core";

const generatePassword = (
  size: number,
  length: number,
  lowercase: boolean,
  uppercase: boolean,
  numeric: boolean,
  special: boolean,
  excludes: string,
) => {
  return invoke<string[]>("generate_password", {
    size,
    length,
    lowercase,
    uppercase,
    numeric,
    special,
    excludes,
  });
};

export { generatePassword };
