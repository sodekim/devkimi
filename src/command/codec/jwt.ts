import { invoke } from "@tauri-apps/api/core";
import { EncodingText, RsaBitSize } from "../crypto/type";

export enum Algorithm {
  HS256 = "HS256",
  HS384 = "HS384",
  HS512 = "HS512",
  RS256 = "RS256",
  RS384 = "RS384",
  RS512 = "RS512",
  ES256 = "ES256",
  ES384 = "ES384",
  ES512 = "ES512",
}

export type Header = {
  alg: Algorithm;
  typ: "JWT";
};

export function encodeJwt(header: Header, payload: string, key: EncodingText) {
  return invoke<string>("encode_jwt", { header, payload, key });
}

export function decodeJwt(token: string, key: EncodingText) {
  return invoke<[Header, string, boolean | null]>("decode_jwt", {
    token,
    key,
  });
}

export function generateJwtEcdsaKeyPair(algorithm: Algorithm) {
  return invoke<[string, string]>("generate_jwt_ecdsa_key_pair", { algorithm });
}

export function generateJwtRsaKeyPair(bitSize: RsaBitSize) {
  return invoke<[string, string]>("generate_jwt_rsa_key_pair", { bitSize });
}
