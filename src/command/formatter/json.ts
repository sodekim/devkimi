import { invoke } from "@tauri-apps/api/core";

export enum Ident {
  TwoSpace = "TwoSpace",
  FourSpace = "FourSpace",
  Tab = "Tab",
  None = "None",
}

const formatJson = async (
  input: string,
  indent: Ident = Ident.TwoSpace,
  sortable: boolean = false,
) => {
  return invoke<string>("format_json", { input, indent, sortable });
};

export { formatJson };
