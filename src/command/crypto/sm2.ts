import { invoke } from "@tauri-apps/api/core";

export type Sm2KeyFormat = "Sec1" | "Pkcs8" | "Hex";

export function generateSm2KeyPair(keyFormat: Sm2KeyFormat) {
  return invoke<string[]>("generate_sm2_key_pair", { keyFormat });
}

export function encryptSm2(
  keyFormat: Sm2KeyFormat,
  publicKey: string,
  text: string,
) {
  return invoke<string>("encrypt_sm2", { keyFormat, publicKey, text });
}

export function decryptSm2(
  keyFormat: Sm2KeyFormat,
  privateKey: string,
  text: string,
) {
  return invoke<string>("decrypt_sm2", { keyFormat, privateKey, text });
}
