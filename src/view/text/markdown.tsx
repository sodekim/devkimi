import { createEffect, createSignal } from "solid-js";
import { parseMarkdown } from "@/command/text/markdown";
import {
  CopyButton,
  SaveButton,
  TextOperateButtons,
} from "@/component/Buttons";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";
import Title from "@/component/Title";
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
    <Container direction="row">
      {/*输入*/}
      <Card class="h-full w-0 flex-1">
        <div class="flex items-center justify-between">
          <Title value="Markdown" />
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
      </Card>

      {/*输出*/}
      <Card class="h-full w-0 flex-1">
        <div class="flex items-center justify-between">
          <Title value="预览" />
          <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost"></button>
          </div>
        </div>
        <div
          id="preview"
          class="prose dark:prose-invert size-full max-w-full overflow-auto rounded-md border border-base-content/20 p-2"
          innerHTML={html()}
        ></div>
      </Card>
    </Container>
  );
}
