import { invoke } from "@tauri-apps/api/core";

export enum Base64Mode {
  Standard = "Standard",
  StandardNoPad = "StandardNoPad",
  UrlSafe = "UrlSafe",
  UrlSafeNoPad = "UrlSafeNoPad",
}

const encodeImageBase64 = (image: string, mode: Base64Mode) => {
  return invoke<string>("encode_image_base64", { image, mode });
};

const decodeImageBase64 = (base64: string, mode: Base64Mode) => {
  return invoke<[string, string]>("decode_image_base64", { base64, mode });
};

const encodeTextBase64 = async (text: string, mode: Base64Mode) => {
  return invoke<string>("encode_text_base64", {
    text,
    mode,
  });
};

const decodeTextBase64 = async (base64: string, mode: Base64Mode) => {
  return invoke<string>("decode_text_base64", {
    base64,
    mode,
  });
};

export {
  encodeImageBase64,
  decodeImageBase64,
  encodeTextBase64,
  decodeTextBase64,
};
