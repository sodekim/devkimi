import { invoke } from "@tauri-apps/api/core";

const formatSql = async (
  input: string,
  indent: string,
  dialect: string,
  uppercase: boolean,
) => {
  return invoke<string>("format_sql", { input, indent, dialect, uppercase });
};

export { formatSql };
