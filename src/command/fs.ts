import { invoke } from "@tauri-apps/api/core";

/**
 * 复制文件
 *
 * @param from 源文件
 * @param to 目标文件
 */
const copyFile = (from: string, to: string) => {
  return invoke<void>("copy_file", { from, to });
};

/**
 * 使用默认应用打开类文件
 *
 * @param path 文件路径
 * @returns Promise<void>
 */
const openFile = (path: string) => {
  return invoke<void>("open_file", { path });
};

/**
 * 打开日志目录
 */
const openLogDir = () => {
  return invoke("open_log_dir", {});
};

const openBase64Image = (base64: string, extension: string) => {
  return invoke("open_base64_image", { base64, extension });
};

const saveBase64Image = (dir: string, base64: string, extension: string) => {
  return invoke("save_base64_image", { dir, base64, extension });
};

export { copyFile, openFile, openLogDir, openBase64Image, saveBase64Image };
