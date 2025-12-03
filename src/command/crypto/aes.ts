import { invoke } from "@tauri-apps/api/core";
import { BitSize, BlockMode, Encoding, EncodingText, Padding } from "./type";

export function generateAesKey(bitSize: BitSize, encoding: Encoding) {
  return invoke<string>("generate_aes_key", { bitSize, encoding });
}

export function generateAesIv(
  bitSize: BitSize,
  blockMode: BlockMode,
  encoding: Encoding,
) {
  return invoke<string>("generate_aes_iv", { bitSize, blockMode, encoding });
}

export function encryptAes(
  bitSize: BitSize,
  input: EncodingText,
  key: EncodingText,
  iv: EncodingText,
  blockMode: BlockMode,
  padding: Padding,
  encoding: Encoding,
) {
  return invoke<string>("encrypt_aes", {
    bitSize,
    input,
    key,
    iv,
    blockMode,
    padding,
    encoding,
  });
}

export function decryptAes(
  bitSize: BitSize,
  input: EncodingText,
  key: EncodingText,
  iv: EncodingText,
  blockMode: BlockMode,
  padding: Padding,
  encoding: Encoding,
) {
  return invoke<string>("decrypt_aes", {
    bitSize,
    input,
    key,
    iv,
    blockMode,
    padding,
    encoding,
  });
}
