import { parseMarkdown } from "@/command/text/markdown";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Title from "@/component/Title";
import hljs from "highlight.js";
import { createEffect, createResource, createSignal } from "solid-js";
import "./a11y-dark.css";
import Main from "@/component/Main";
import { stringify } from "@/lib/util";

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = createSignal("");
  const [html] = createResource(
    () => markdown(),
    (markdown) => {
      if (markdown) {
        return parseMarkdown(markdown).catch(stringify);
      }
      return "";
    },
    { initialValue: "" },
  );

  // 高亮Markdown
  createEffect(() => {
    if (html.state === "ready" && html()) {
      hljs.highlightAll();
    }
  });

  return (
    <Container>
      <Main>
        {/*输入*/}
        <Card class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title>Markdown</Title>
            <div class="flex items-center justify-center gap-2">
              <TextReadButtons value={markdown()} />
              <TextWriteButtons callback={setMarkdown} />
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
            <Title loading={html.loading}>预览</Title>
          </div>
          <div
            id="preview"
            class="prose dark:prose-invert border-base-content/20 size-full max-w-full overflow-auto rounded-md border p-2"
            innerHTML={html()}
          ></div>
        </Card>
      </Main>
    </Container>
  );
}
