import { invoke } from "@tauri-apps/api/core";

export type Sm4Mode = "CBC" | "CFB" | "CTR" | "OFB" | "ECB";

export function sm4_encrypt(key: string, input: string, mode: Sm4Mode, iv?: string) {
    return invoke<string>("sm4_encrypt", { key, input, mode, iv })
}

export function sm4_decrypt(key: string, input: string, mode: Sm4Mode, iv?: string) {
    return invoke<string>("sm4_decrypt", { key, input, mode, iv })
}