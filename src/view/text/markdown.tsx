import { parseMarkdown } from "@/command/text/markdown";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Page from "@/component/Page";
import Editor from "@/component/Editor";
import Flex from "@/component/Flex";
import Container from "@/component/Container";
import { stringify } from "@/lib/util";
import hljs from "highlight.js";
import { createEffect, createResource, createSignal } from "solid-js";
import "./a11y-dark.css";

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
    <Page>
      <Container>
        {/*输入*/}
        <Card
          class="h-full w-0 flex-1"
          title="Markdown"
          operation={
            <Flex>
              <TextReadButtons value={markdown()} />
              <TextWriteButtons callback={setMarkdown} />
            </Flex>
          }
        >
          <Editor
            value={markdown()}
            onChange={(value) => setMarkdown(value)}
            language="markdown"
          />
        </Card>

        {/*输出*/}
        <Card class="h-full w-0 flex-1" title="预览">
          <div
            id="preview"
            class="prose dark:prose-invert border-base-content/20 size-full max-w-full overflow-auto rounded-md border p-2"
            innerHTML={html()}
          ></div>
        </Card>
      </Container>
    </Page>
  );
}
