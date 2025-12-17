import { invoke } from "@tauri-apps/api/core";

const parseCron =  (cron: string, size: number, pattern: string) => {
  return invoke<string[]>("parse_cron", { cron, size, pattern });
};

export { parseCron };
