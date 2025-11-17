import _ from "lodash";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { createEffect, onCleanup, onMount } from "solid-js";
import { twMerge } from "tailwind-merge";
import { accessor, MaybeAccessor } from "../utils/accessor";
import { useSettings } from "../store";

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
type EditorProps = Omit<MonacoEditorOptions, "value"> & {
  onChange?: (content: string) => void;
  onSetup?: (editor: MonacoEditor) => void;
  value?: MaybeAccessor<string>;
  class?: string;
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

const editors = [];

export default function Editor({
  onSetup,
  onChange,
  value,
  class: _class,
  ...props
}: EditorProps) {
  const id = _.uniqueId("editor-");
  let editor: MonacoEditor | null = null;
  const [settings] = useSettings();
  onMount(() => {
    const container = document.getElementById(id)!;

    // 创建编辑器
    const _editor = monaco.editor.create(container!, {
      language: "plaintext",
      automaticLayout: true,
      stickyScroll: {
        enabled: false,
      },
      minimap: {
        enabled: false,
      },
      theme: settings.theme,
      fontSize: settings.font.size,
      fontFamily: settings.font.family,
      scrollBeyondLastLine: false,
      ...props,
    });

    // 监听内容变化
    if (onChange) {
      _editor.onDidChangeModelContent(() => {
        onChange(_editor.getValue());
      });
    }

    // 更新编辑器内容
    if (value) {
      const _value = accessor(value);
      createEffect(() => {
        const snapshot = _value();
        if (snapshot !== _editor.getValue()) {
          _editor.setValue(snapshot);
        }
      });
    }

    // 调用 onSetup 回调
    if (onSetup) {
      onSetup(_editor);
    }

    // 保存实例
    editors.push(_editor);
    editor = _editor;
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
      class={twMerge("input h-0 w-full flex-1 outline-none", _class)}
    ></div>
  );
}

export type { MonacoEditor, MonacoEditorOptions };
