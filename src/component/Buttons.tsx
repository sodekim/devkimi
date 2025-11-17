import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { DialogFilter, open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
  CircleCheckBig,
  Clipboard,
  Copy,
  Eraser,
  Eye,
  File,
  Save,
} from "lucide-solid";
import { createSignal } from "solid-js";
import { openFile } from "../command/fs";
import { accessor, MaybeAccessor } from "../utils/accessor";

const CopyButton = ({ value }: { value: MaybeAccessor<string> }) => {
  const [handle, setHandle] = createSignal<number | null>(null);
  const _value = accessor(value);
  return (
    <button
      class="btn btn-sm"
      onClick={() =>
        writeText(_value())
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

const PasteButton = ({ onRead }: { onRead: (value: string) => void }) => {
  return (
    <button class="btn btn-sm" onClick={() => readText().then(onRead)}>
      <Clipboard size={16} /> 粘贴
    </button>
  );
};

const ClearButton = ({ onClick }: { onClick: (event: MouseEvent) => void }) => {
  return (
    <button class="btn btn-sm" onClick={onClick}>
      <Eraser size={16} />
      清空
    </button>
  );
};

const PickFileButton = ({
  label,
  filters,
  onPick,
  multiple,
}: {
  label?: string;
  filters?: DialogFilter[];
  multiple?: boolean;
  onPick: (file: string | null) => void;
}) => {
  const _label = label || "选择文件";
  const _multiple = multiple || false;
  return (
    <button
      class="btn btn-sm"
      onClick={() => {
        open({
          title: _label,
          filters,
          multiple: _multiple,
        })
          .then((file) => onPick(file))
          .catch((e) => console.error("pick file error: " + e));
      }}
    >
      <File size={16} />
      {_label}
    </button>
  );
};

const PickImageFileButton = ({
  label = "选择图片",
  multiple,
  onPick,
}: {
  label?: string;
  multiple?: boolean;
  onPick: (value: string | null) => void;
}) => {
  return (
    <PickFileButton
      onPick={onPick}
      multiple={multiple}
      label={label}
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

const PickTextFileButton = ({
  onPick,
  ...props
}: {
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
            .then(onPick)
            .catch((e) => console.error("read text file error!", e));
        }
      }}
    ></PickFileButton>
  );
};

const OpenFileButton = ({ path }: { path: MaybeAccessor<string> }) => {
  const _path = accessor(path);
  return (
    <button
      class="btn btn-sm"
      onClick={() => {
        openFile(_path())
          .then(() => console.log(`open file success: ${_path()}`))
          .catch((e) => console.error(`open file error: ${_path()}`, e));
      }}
    >
      <Eye size={16} /> 查看
    </button>
  );
};

const SaveButton = ({ value }: { value: MaybeAccessor<string> }) => {
  const _value = accessor(value);
  return (
    <button
      class="btn btn-sm"
      onClick={() =>
        save().then((file) => {
          if (file) {
            writeTextFile(file, _value()).catch((e) =>
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

const TextOperateButtons = ({
  callback,
}: {
  callback: (value: string) => void;
}) => {
  return (
    <>
      <PickTextFileButton onPick={callback} />
      <PasteButton onRead={callback} />
      <ClearButton onClick={() => callback("")} />
    </>
  );
};

export {
  ClearButton,
  CopyButton,
  OpenFileButton,
  PasteButton,
  PickFileButton,
  PickImageFileButton,
  PickTextFileButton,
  SaveButton,
  TextOperateButtons,
};
