import { invoke } from "@tauri-apps/api/core";

/**
 * 复制文件
 *
 * @param from 源文件
 * @param to 目标文件
 */
const copyFile = async (from: string, to: string) => {
  return invoke<void>("copy_file", { from, to });
};

/**
 * 使用默认应用打开类文件
 *
 * @param path 文件路径
 * @returns Promise<void>
 */
const openFile = async (path: string) => {
  return invoke<void>("open_file", { path });
};

export { copyFile, openFile };
