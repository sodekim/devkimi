import { invoke } from "@tauri-apps/api/core";
import { EncodingText } from "../crypto/type";

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

export function encodeJwt(
  header: Header,
  payload: string,
  secret: EncodingText,
) {
  return invoke<string>("encode_jwt", { header, payload, secret });
}

export function decodeJwt(token: string, secret: EncodingText) {
  return invoke<[Header, string, boolean | null]>("decode_jwt", {
    token,
    secret,
  });
}
