import { invoke } from "@tauri-apps/api/core";

export type KeyFormat = "Pkcs1" | "Pkcs8";

export function generate_rsa_key_pair(keyFormat: KeyFormat, bitSize: number) {
    return invoke<string[]>("generate_rsa_key_pair", { keyFormat, bitSize })
}

export function encrypt_rsa(keyFormat: KeyFormat, publicKey: string, text: string) {
    return invoke<string>("encrypt_rsa", { keyFormat, publicKey, text })
}

export function decrypt_rsa(keyFormat: KeyFormat, privateKey: string, text: string) {
    return invoke<string>("decrypt_rsa", { keyFormat, privateKey, text })
}
