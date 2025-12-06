import { createStore } from "solid-js/store";

export enum AesBitSize {
  Bit128 = "Bits128",
  Bit192 = "Bits192",
  Bit256 = "Bits256",
}

export enum DesBitSize {
  Bits64 = "Bits64",
  Bits192 = "Bits192",
}

export enum KeyFormat {
  Pkcs1 = "Pkcs1",
  Pkcs8 = "Pkcs8",
}

export enum BlockMode {
  Cbc = "Cbc",
  Cfb = "Cfb",
  Ctr = "Ctr",
  Ofb = "Ofb",
  Ecb = "Ecb",
}

export enum Padding {
  Pkcs7 = "Pkcs7",
  Iso7816 = "Iso7816",
  Iso10126 = "Iso10126",
  Zero = "Zero",
  None = "None",
}

export const BLOCK_MODE_OPTIONS = [
  { value: "Cbc", label: "CBC (Cipher Block Chaining)" },
  { value: "Cfb", label: "CFB (Cipher Feed Back)" },
  { value: "Ctr", label: "CTR (Counter)" },
  { value: "Ofb", label: "OFB (Output Feed Back)" },
  { value: "Ecb", label: "ECB (Electronic Code Book)" },
];

export const PADDING_OPTIONS = [
  { value: "Pkcs7", label: "Pkcs7" },
  { value: "Iso7816", label: "Iso7816" },
  { value: "Iso10126", label: "Iso10126" },
  { value: "Zero", label: "Zero" },
  { value: "None", label: "None" },
];

export const BIT_SIZE_OPTIONS = [
  { value: "Bits128", label: "128 bits" },
  { value: "Bits192", label: "192 bits" },
  { value: "Bits256", label: "256 bits" },
];

export const DES_BIT_SIZE_OPTIONS = [
  { value: "Bits64", label: "DES (64 bits)" },
  { value: "Bits192", label: "3DES (192 bits)" },
];

export enum Encoding {
  Utf8 = "Utf8",
  Base64 = "Base64",
  Hex = "Hex",
}

export type EncodingText = { text: string; encoding: Encoding };

export function createEncodingText(params?: Partial<EncodingText>) {
  const { text, encoding } = params ?? { text: "", encoding: Encoding.Utf8 };
  return createStore<EncodingText>({
    text: text ?? "",
    encoding: encoding ?? Encoding.Utf8,
  });
}
