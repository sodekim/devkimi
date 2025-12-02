import { invoke } from "@tauri-apps/api/core";
import { BitSize, BlockMode, Encoding, EncodingText, Padding } from "./type";

export function encrypt_aes(
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

export function decrypt_aes(
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
