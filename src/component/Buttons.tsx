import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { DialogFilter, open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
  CircleCheckBig,
  Clipboard,
  Copy,
  Dices,
  Eraser,
  Eye,
  File,
  Save,
} from "lucide-solid";
import { createSignal } from "solid-js";
import { openFile } from "@/command/fs";

const CopyButton = (props: { value: string }) => {
  const [handle, setHandle] = createSignal<number | null>(null);
  return (
    <button
      class="btn btn-sm"
      onClick={() =>
        writeText(props.value)
          .then(() => console.log("复制成功"))
          .catch((e) => console.error("复制失败: " + e))
          .finally(() => {
            let _handle = handle();
            if (_handle) {
              clearTimeout(_handle);
            }
            setHandle(setTimeout(() => setHandle(null), 3000));
          })
      }
    >
      {handle() ? (
        <CircleCheckBig size={16} color="var(--color-success)" />
      ) : (
        <Copy size={16} />
      )}
      复制
    </button>
  );
};

const PasteButton = (props: { onRead: (value: string) => void }) => {
  return (
    <button class="btn btn-sm" onClick={() => readText().then(props.onRead)}>
      <Clipboard size={16} /> 粘贴
    </button>
  );
};

const ClearButton = (props: { onClick: (event: MouseEvent) => void }) => {
  return (
    <button class="btn btn-sm" onClick={props.onClick}>
      <Eraser size={16} />
      清空
    </button>
  );
};

const PickFileButton = (props: {
  label?: string;
  filters?: DialogFilter[];
  multiple?: boolean;
  onPick: (file: string | null) => void;
}) => {
  return (
    <button
      class="btn btn-sm"
      onClick={() => {
        open({
          title: props.label || "选择文件",
          filters: props.filters,
          multiple: props.multiple,
        })
          .then((file) => props.onPick(file))
          .catch((e) => console.error("pick file error: " + e));
      }}
    >
      <File size={16} />
      {props.label || "选择文件"}
    </button>
  );
};

const PickImageFileButton = (props: {
  label?: string;
  multiple?: boolean;
  onPick: (value: string | null) => void;
}) => {
  return (
    <PickFileButton
      onPick={props.onPick}
      multiple={props.multiple}
      label={props.label}
      filters={[
        {
          name: "Images",
          extensions: [
            "jpg",
            "jpeg",
            "png",
            "bmp",
            "svg",
            "webp",
            "gif",
            "ico",
          ],
        },
      ]}
    />
  );
};

const PickTextFileButton = (props: {
  label?: string;
  filters?: DialogFilter[];
  multiple?: boolean;
  onPick: (value: string) => void;
}) => {
  return (
    <PickFileButton
      {...props}
      onPick={(file) => {
        if (file) {
          readTextFile(file)
            .then(props.onPick)
            .catch((e) => console.error("read text file error!", e));
        }
      }}
    ></PickFileButton>
  );
};

const OpenFileButton = (props: { path: string }) => {
  return (
    <button
      class="btn btn-sm"
      onClick={() => {
        openFile(props.path)
          .then(() => console.log(`open file success: ${props.path}`))
          .catch((e) => console.error(`open file error: ${props.path}`, e));
      }}
    >
      <Eye size={16} /> 查看
    </button>
  );
};

const SaveButton = (props: { value: string }) => {
  return (
    <button
      class="btn btn-sm"
      onClick={() =>
        save().then((file) => {
          if (file) {
            writeTextFile(file, props.value).catch((e) =>
              console.error("write text file error!", e),
            );
          }
        })
      }
    >
      <Save size={16} /> 保存
    </button>
  );
};

const TextOperateButtons = (props: { callback: (value: string) => void }) => {
  return (
    <>
      <PickTextFileButton onPick={props.callback} />
      <PasteButton onRead={props.callback} />
      <ClearButton onClick={() => props.callback("")} />
    </>
  );
};

const GenerateButton = (props: { onGenerate: () => void }) => {
  return (
    <button class="btn btn-sm" onClick={props.onGenerate}>
      <Dices size={16} /> 生成
    </button>
  );
};

export {
  ClearButton,
  CopyButton,
  GenerateButton,
  OpenFileButton,
  PasteButton,
  PickFileButton,
  PickImageFileButton,
  PickTextFileButton,
  SaveButton,
  TextOperateButtons
};

