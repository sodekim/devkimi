import { invoke } from "@tauri-apps/api/core";
import { AesBitSize, BlockMode, Encoding, EncodingText, Padding } from "./type";

export function generateAesKey(bitSize: AesBitSize, encoding: Encoding) {
  return invoke<string>("generate_aes_key", { bitSize, encoding });
}

export function generateAesIv(
  bitSize: AesBitSize,
  blockMode: BlockMode,
  encoding: Encoding,
) {
  return invoke<string>("generate_aes_iv", { bitSize, blockMode, encoding });
}

export function encryptAes(
  bitSize: AesBitSize,
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
  bitSize: AesBitSize,
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
