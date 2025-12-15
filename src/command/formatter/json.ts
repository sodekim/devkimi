import { invoke } from "@tauri-apps/api/core";

const formatJson = async (
  input: string,
  indent: string = "TwoSpace",
  sortable: boolean = false,
) => {
  return invoke<string>("format_json", { input, indent, sortable });
};

export { formatJson };
