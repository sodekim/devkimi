import {
  AesBitSize,
  BlockMode,
  DesBitSize,
  Padding,
  RsaBitSize,
} from "@/command/crypto/type";

export const DES_BIT_SIZE_OPTIONS = [
  { value: DesBitSize.Bits64, label: "DES (64 bits)" },
  { value: DesBitSize.Bits192, label: "3DES (192 bits)" },
];

export const AES_BIT_SIZE_OPTIONS = [
  { value: AesBitSize.Bits128, label: "128 bits" },
  { value: AesBitSize.Bits192, label: "192 bits" },
  { value: AesBitSize.Bits256, label: "256 bits" },
];

export const RSA_BIT_SIZE_OPTIONS = [
  {
    value: RsaBitSize.Bits1024,
    label: "1024 bits",
  },
  {
    value: RsaBitSize.Bits2048,
    label: "2048 bits",
  },
  {
    value: RsaBitSize.Bits3072,
    label: "3072 bits",
  },
  {
    value: RsaBitSize.Bits4096,
    label: "4096 bits",
  },
];

export const BLOCK_MODE_OPTIONS = [
  { value: BlockMode.Cbc, label: "CBC (Cipher Block Chaining)" },
  { value: BlockMode.Cfb, label: "CFB (Cipher Feed Back)" },
  { value: BlockMode.Ctr, label: "CTR (Counter)" },
  { value: BlockMode.Ofb, label: "OFB (Output Feed Back)" },
  { value: BlockMode.Ecb, label: "ECB (Electronic Code Book)" },
];

export const PADDING_OPTIONS = [
  { value: Padding.Pkcs7, label: "Pkcs7" },
  { value: Padding.Iso7816, label: "Iso7816" },
  { value: Padding.Iso10126, label: "Iso10126" },
  { value: Padding.Zero, label: "Zero" },
  { value: Padding.None, label: "None" },
];
