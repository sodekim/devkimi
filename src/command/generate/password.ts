import { invoke } from "@tauri-apps/api/core";

const generatePassword = async (
  size: number,
  length: number,
  lowercase: boolean,
  uppercase: boolean,
  numberic: boolean,
  special: boolean,
  excludes: string,
) => {
  return invoke<string[]>("generate_password", {
    size,
    length,
    lowercase,
    uppercase,
    numberic,
    special,
    excludes,
  });
};

export { generatePassword };
