import { invoke } from "@tauri-apps/api/core";
import { BlockMode, Encoding, EncodingText, Padding } from "./type";

export function generateSm4Key(encoding: Encoding) {
  return invoke<string>("generate_sm4_key", { encoding });
}

export function generateSm4Iv(blockMode: BlockMode, encoding: Encoding) {
  return invoke<string>("generate_sm4_iv", { blockMode, encoding });
}

export function encrypt_sm4(
  input: EncodingText,
  key: EncodingText,
  iv: EncodingText,
  blockMode: BlockMode,
  padding: Padding,
  encoding: Encoding,
) {
  return invoke<string>("encrypt_sm4", {
    input,
    key,
    iv,
    blockMode,
    padding,
    encoding,
  });
}

export function decrypt_sm4(
  input: EncodingText,
  key: EncodingText,
  iv: EncodingText,
  blockMode: BlockMode,
  padding: Padding,
  encoding: Encoding,
) {
  return invoke<string>("decrypt_sm4", {
    input,
    key,
    iv,
    blockMode,
    padding,
    encoding,
  });
}
