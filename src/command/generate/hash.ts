import { invoke } from "@tauri-apps/api/core";

const generateTextHash = async (
  text: string,
  algorithm: string,
  uppercase: boolean,
) => {
  return invoke<string>("generate_text_hash", { text, algorithm, uppercase });
};

const generateFileHash = async (
  file: string,
  algorithm: string,
  uppercase: boolean,
) => {
  return invoke<string>("generate_file_hash", { file, algorithm, uppercase });
};

export { generateTextHash, generateFileHash };
