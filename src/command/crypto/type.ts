import { createStore } from "solid-js/store";

export type KeyPair = { private: string; public: string };
export type SizedKeyPair<T> = { private: string; public: string; size: T };
export type RsaKeyPair = SizedKeyPair<RsaBitSize>;

export enum AesBitSize {
  Bits128 = "Bits128",
  Bits192 = "Bits192",
  Bits256 = "Bits256",
}

export enum DesBitSize {
  Bits64 = "Bits64",
  Bits192 = "Bits192",
}

export enum RsaBitSize {
  Bits1024 = "Bits1024",
  Bits2048 = "Bits2048",
  Bits3072 = "Bits3072",
  Bits4096 = "Bits4096",
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
