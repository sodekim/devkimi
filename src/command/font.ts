import { invoke } from "@tauri-apps/api/core";

const getSystemFonts = () => {
  return invoke<string[]>("get_system_fonts");
};

export { getSystemFonts };
