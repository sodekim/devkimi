import _ from "lodash";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { createEffect, onCleanup, onMount, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useSettings } from "@/store";

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

type MonacoEditor = monaco.editor.IStandaloneCodeEditor;
type MonacoEditorOptions = monaco.editor.IStandaloneEditorConstructionOptions;
type EditorProps = Omit<
  MonacoEditorOptions,
  "value" | "model" | "placeholder"
> & {
  onChange?: (content: string) => void;
  onSetup?: (editor: MonacoEditor) => void;
  value?: string;
  class?: string;
  placeholder?: string;
};

monaco.editor.defineTheme("light", {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#ffffff",
  },
});

monaco.editor.defineTheme("dark", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#1d232a",
  },
});

monaco.editor.defineTheme("dracula", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#282a36",
  },
});

export default function Editor(props: EditorProps) {
  const id = _.uniqueId("editor-");
  let editor: MonacoEditor | null = null;
  const [settings] = useSettings();
  const [local, options] = splitProps(props, [
    "onSetup",
    "onChange",
    "value",
    "class",
    "placeholder",
  ]);

  // 初始化编辑器
  onMount(() => {
    // 编辑器容器
    const container = document.getElementById(id)!;

    // 创建编辑器
    editor = monaco.editor.create(container!, {
      placeholder: local.placeholder,
      language: "plaintext",
      automaticLayout: true,
      stickyScroll: {
        enabled: false,
      },
      minimap: {
        enabled: false,
      },
      theme: settings.common.theme,
      fontSize: settings.editor.font.size,
      fontFamily: settings.editor.font.family,
      wordWrap: settings.editor.wordWrap,
      scrollBeyondLastLine: false,
      ...options,
    });

    // 监听占位符变化
    createEffect(() => {
      editor?.updateOptions({ placeholder: local.placeholder });
    });

    // 监听内容变化
    if (local.onChange) {
      editor.onDidChangeModelContent(() => {
        local.onChange?.(editor!.getValue());
      });
    }

    // 更新编辑器内容
    createEffect(() => {
      if (local.value !== editor!.getValue()) {
        editor!.setValue(local.value || "");
      }
    });

    // 调用 onSetup 回调
    if (local.onSetup) {
      local.onSetup(editor);
    }
  });

  // 清理Editor实例
  onCleanup(() => {
    if (editor != null) {
      // 销毁实例
      editor.dispose();
    }
  });

  return (
    <div
      id={id}
      class={twMerge("input h-0 w-full flex-1 p-2 outline-none", local.class)}
    ></div>
  );
}

export type { MonacoEditor, MonacoEditorOptions };
