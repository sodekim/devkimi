import { invoke } from "@tauri-apps/api/core";

const getSystemFonts = async () => {
  return invoke<string[]>("get_system_fonts");
};

export { getSystemFonts };
