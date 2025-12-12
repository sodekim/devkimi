import { invoke } from "@tauri-apps/api/core";
import { KeyFormat } from "./type";

export function generateRsaKeyPair(keyFormat: KeyFormat, bitSize: number) {
  return invoke<[string, string]>("generate_rsa_key_pair", {
    keyFormat,
    bitSize,
  });
}

export function encryptRsa(
  keyFormat: KeyFormat,
  publicKey: string,
  text: string,
) {
  return invoke<string>("encrypt_rsa", { keyFormat, publicKey, text });
}

export function decryptRsa(
  keyFormat: KeyFormat,
  privateKey: string,
  text: string,
) {
  return invoke<string>("decrypt_rsa", { keyFormat, privateKey, text });
}
