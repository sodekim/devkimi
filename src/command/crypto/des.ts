import { invoke } from "@tauri-apps/api/core";
import { BlockMode, DesBitSize, Encoding, EncodingText, Padding } from "./type";

export function generateDesKey(bitSize: DesBitSize, encoding: Encoding) {
  return invoke<string>("generate_des_key", { bitSize, encoding });
}

export function generateDesIv(
  bitSize: DesBitSize,
  blockMode: BlockMode,
  encoding: Encoding,
) {
  return invoke<string>("generate_des_iv", { bitSize, blockMode, encoding });
}

export function encrypt_des(
  bitSize: DesBitSize,
  input: EncodingText,
  key: EncodingText,
  iv: EncodingText,
  blockMode: BlockMode,
  padding: Padding,
  encoding: Encoding,
) {
  return invoke<string>("encrypt_des", {
    bitSize,
    input,
    key,
    iv,
    blockMode,
    padding,
    encoding,
  });
}

export function decrypt_des(
  bitSize: DesBitSize,
  input: EncodingText,
  key: EncodingText,
  iv: EncodingText,
  blockMode: BlockMode,
  padding: Padding,
  encoding: Encoding,
) {
  return invoke<string>("decrypt_des", {
    bitSize,
    input,
    key,
    iv,
    blockMode,
    padding,
    encoding,
  });
}
