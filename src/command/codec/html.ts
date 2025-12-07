import { invoke } from "@tauri-apps/api/core";

export function encodeHtml(input: string) {
    return invoke<string>("encode_html", { input });
}

export function decodeHtml(input: string) {
    return invoke<string>("decode_html", { input });
}
