import { createElementBounds } from "@solid-primitives/bounds";
import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
  CircleCheckBig,
  Clipboard,
  Copy,
  Ellipsis,
  Eraser,
  File,
  Save,
} from "lucide-solid";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  Match,
  onMount,
  Show,
  splitProps,
  Switch,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { useCardIndex, useCardMaximizable } from "./Container";
import Flex from "./Flex";
import Title from "./Title";

interface Operation {
  class?: string;
  icon?: JSX.Element;
  label?: string;
  onClick?: () => void;
}

interface OperationButtonsProps {
  breakpoint?: number;
  items: Operation[];
}

const OperationButtons = (props: OperationButtonsProps) => {
  const [ref, setRef] = createSignal<HTMLElement>();
  const bounds = createElementBounds(ref);
  const small = createMemo(() => {
    if (props.breakpoint && bounds.width) {
      return bounds.width < props.breakpoint;
    }
    return false;
  });
  return (
    <div class="flex flex-1 items-center justify-end" ref={(e) => setRef(e)}>
      <Switch>
        <Match when={small()}>
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-sm">
              <Ellipsis size={16} />
            </div>
            <Flex
              tabindex="-1"
              class="dropdown-content bg-base-300 rounded-box w-30 justify-start p-2 shadow-sm"
              direction="vertical"
            >
              <For each={props.items}>
                {(item) => (
                  <button
                    class={twMerge(
                      "btn btn-sm btn-block justify-start",
                      item.class,
                    )}
                    onClick={() => item.onClick?.()}
                  >
                    {item.icon} {item.label}
                  </button>
                )}
              </For>
            </Flex>
          </div>
        </Match>
        <Match when={!small()}>
          <Flex>
            <For each={props.items}>
              {(item) => (
                <button
                  class={twMerge("btn btn-sm", item.class)}
                  onClick={() => item.onClick?.()}
                >
                  {item.icon} {item.label}
                </button>
              )}
            </For>
          </Flex>
        </Match>
      </Switch>
    </div>
  );
};

export default function Card(
  props: {
    class?: string;
    title?: JSX.Element;
    loading?: boolean;
    children?: JSX.Element;
    operation?: OperationButtonsProps | Operation[];
    notification?: JSX.Element;
  } & JSX.DOMAttributes<HTMLDivElement>,
) {
  const [_props, attributes] = splitProps(props, [
    "class",
    "title",
    "loading",
    "children",
    "operation",
    "notification",
  ]);

  const operation = () => {
    if (_props.operation) {
      if (Array.isArray(_props.operation)) {
        return { items: _props.operation };
      } else {
        return _props.operation;
      }
    }
  };

  const index = useCardIndex();
  console.log("index: ", index);

  return (
    <div
      class={twMerge("flex flex-col gap-2 px-4 py-2", _props.class)}
      {...attributes}
    >
      <div class="flex items-center justify-between">
        <Show when={_props.title}>
          <Flex>
            <Title loading={_props.loading}>{_props.title}</Title>
            <Show when={_props.notification}>{_props.notification}</Show>
          </Flex>
        </Show>
        <Show when={operation()}>
          <OperationButtons
            items={operation()!.items}
            breakpoint={operation()?.breakpoint ?? 300}
          />
        </Show>
      </div>
      {_props.children}
    </div>
  );
}

export function writeTextOperations(callback: (value: string) => void) {
  return [
    {
      icon: <File size={16} />,
      label: "导入文件",
      onClick: () => {
        open({ title: "导入文件", multiple: false }).then((file) => {
          if (file) {
            readTextFile(file).then(callback);
          }
        });
      },
    },
    {
      icon: <Clipboard size={16} />,
      label: "粘贴",
      onClick: () => {
        readText().then(callback);
      },
    },
    {
      icon: <Eraser size={16} />,
      label: "清空",
      onClick: () => {
        callback("");
      },
    },
  ];
}

export function readTextOperations(value: Accessor<string>) {
  const [handle, setHandle] = createSignal<number>();
  return [
    {
      icon: (
        <Show when={handle()} fallback={<Copy size={16} />}>
          <CircleCheckBig size={16} color="var(--color-success)" />
        </Show>
      ),
      label: "复制",
      onClick: () => {
        writeText(value())
          .then(() => console.log("复制成功"))
          .catch((e) => console.error("复制失败: " + e))
          .finally(() => {
            let _handle = handle();
            if (_handle) {
              clearTimeout(_handle);
            }
            setHandle(setTimeout(() => setHandle(), 3000));
          });
      },
    },
    {
      icon: <Save size={16} />,
      label: "保存",
      onClick: () => {
        save().then((file) => {
          if (file) {
            writeTextFile(file, value()).catch((e) =>
              console.error("write text file error!", e),
            );
          }
        });
      },
    },
  ];
}
