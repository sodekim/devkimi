import { createEffect, createSignal } from "solid-js";
import { parseMarkdown } from "../../command/text/markdown";
import {
  CopyButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Container from "../../component/Container";
import Editor from "../../component/Editor";
import hljs from "highlight.js";
import "./a11y-dark.css";

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = createSignal("");
  const [html, setHtml] = createSignal("");
  createEffect(() => {
    if (markdown().length > 0) {
      parseMarkdown(markdown())
        .then(setHtml)
        .then(() => hljs.highlightAll())
        .catch((e) => setHtml(e.toString()));
    } else {
      setHtml("");
    }
  });

  return (
    <div class="flex size-0 h-full w-full flex-row gap-4">
      {/*输入*/}
      <Container class="h-full w-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">Markdown</span>
          <div class="flex items-center justify-center gap-2">
            <CopyButton value={markdown()} />
            <SaveButton value={markdown()} />
            <TextOperateButtons callback={setMarkdown} />
          </div>
        </div>
        <Editor
          value={markdown()}
          onChange={(value) => setMarkdown(value)}
          language="markdown"
        />
      </Container>

      {/*输出*/}
      <Container class="h-full w-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">预览</span>
          <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost"></button>
          </div>
        </div>
        <div
          id="preview"
          class="prose dark:prose-invert size-full max-w-full overflow-auto rounded-md px-2"
          innerHTML={html()}
        ></div>
      </Container>
    </div>
  );
}
