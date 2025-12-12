import { invoke } from "@tauri-apps/api/core";

export function queryDns(name: string) {
  return invoke<{ v4: string[]; v6: string[]; cname: string[] }>("query_dns", {
    name,
  });
}
