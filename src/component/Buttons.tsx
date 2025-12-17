import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { DialogFilter, open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
  CircleCheckBig,
  Clipboard,
  Copy,
  Dices,
  Ellipsis,
  Eraser,
  Eye,
  File,
  Save,
} from "lucide-solid";
import {
  children,
  createEffect,
  createSignal,
  For,
  JSX,
  Match,
  Switch,
} from "solid-js";
import { openBase64Image, openFile, saveBase64Image } from "@/command/fs";
import Flex from "./Flex";
import { createElementBounds } from "@solid-primitives/bounds";
import { twMerge } from "tailwind-merge";

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
    <button
      class="btn btn-sm btn-block"
      onClick={() => readText().then(props.onRead)}
    >
      <Clipboard size={16} /> 粘贴
    </button>
  );
};

const ClearButton = (props: { onClick: (event: MouseEvent) => void }) => {
  return (
    <button class="btn btn-sm btn-block" onClick={props.onClick}>
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
      class="btn btn-sm btn-block"
      onClick={() => {
        open({
          title: props.label || "导入文件",
          filters: props.filters,
          multiple: props.multiple,
        })
          .then((file) => props.onPick(file))
          .catch((e) => console.error("pick file error: " + e));
      }}
    >
      <File size={16} />
      {props.label || "导入文件"}
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

const OpenBase64ImageButton = (props: {
  base64: string;
  extension: string;
}) => {
  return (
    <button
      class="btn btn-sm"
      onClick={() => openBase64Image(props.base64, props.extension)}
    >
      <Eye size={16} /> 查看
    </button>
  );
};

const SaveBase64ImageButton = (props: {
  base64: string;
  extension: string;
}) => {
  return (
    <button
      class="btn btn-sm"
      onClick={() => {
        open({
          title: "保存图片",
          directory: true,
          multiple: false,
        }).then((dir) => {
          if (dir) {
            saveBase64Image(dir, props.base64, props.extension);
          }
        });
      }}
    >
      <Save size={16} />
      保存
    </button>
  );
};

const Base64ImageButtons = (props: { base64: string; extension: string }) => {
  return (
    <Flex>
      <SaveBase64ImageButton
        base64={props.base64}
        extension={props.extension}
      />
      <OpenBase64ImageButton
        base64={props.base64}
        extension={props.extension}
      />
    </Flex>
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

const TextWriteButtons = (props: {
  callback: (value: string) => void;
  children?: JSX.Element;
  position?: "before" | "after";
}) => {
  const _children = children(() => props.children);
  return (
    <div class="flex items-center justify-center gap-2">
      {props.position === "before" && _children()}
      <PickTextFileButton onPick={props.callback} />
      <PasteButton onRead={props.callback} />
      <ClearButton onClick={() => props.callback("")} />
      {props.position !== "before" && _children()}
    </div>
  );
};

const TextReadButtons = (props: {
  value?: string;
  children?: JSX.Element;
  position?: "before" | "after";
}) => {
  const _children = children(() => props.children);
  return (
    <div class="flex items-center justify-center gap-2">
      {props.position === "before" && _children()}
      <CopyButton value={props.value ?? ""} />
      <SaveButton value={props.value ?? ""} />
      {props.position !== "before" && _children()}
    </div>
  );
};

const GenerateButton = (props: { onGenerate: () => void; label?: string }) => {
  return (
    <button class="btn btn-sm" onClick={props.onGenerate}>
      <Dices size={16} /> {props.label || "生成密钥"}
    </button>
  );
};

interface Operation {
  label?: string;
  onClick?: () => void;
  class?: string;
}

const OperationButtons = (props: {
  class?: string;
  gap?: number;
  breakpoint?: number;
  items: Operation[];
}) => {
  const [ref, setRef] = createSignal<HTMLElement>();
  const bounds = createElementBounds(ref);
  const isSmall = () => (bounds?.width ?? 0) < (props.breakpoint || 0);
  const buttons = () => (
    <For each={props.items}>
      {(item) => (
        <button
          class={twMerge("btn btn-sm", item.class)}
          onClick={() => item.onClick?.()}
        >
          {item.label}
        </button>
      )}
    </For>
  );
  return (
    <div class="flex flex-1 items-center justify-end" ref={(e) => setRef(e)}>
      <Switch>
        <Match when={isSmall()}>
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-sm">
              <Ellipsis size={16} />
            </div>
            <Flex
              tabindex="-1"
              class="dropdown-content bg-base-100 rounded-box z-1 w-30 justify-start p-2 shadow-sm"
              direction="vertical"
            >
              {buttons()}
            </Flex>
          </div>
        </Match>
        <Match when={!isSmall()}>
          <Flex class={props.class} gap={props.gap}>
            {buttons()}
          </Flex>
        </Match>
      </Switch>
    </div>
  );
};

export {
  ClearButton,
  CopyButton,
  GenerateButton,
  OpenBase64ImageButton,
  SaveBase64ImageButton,
  Base64ImageButtons,
  PasteButton,
  PickFileButton,
  PickImageFileButton,
  PickTextFileButton,
  SaveButton,
  TextWriteButtons,
  TextReadButtons,
  OperationButtons,
};
