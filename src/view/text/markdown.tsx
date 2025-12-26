import { parseMarkdown } from "@/command/text/markdown";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Flex from "@/component/Flex";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import hljs from "highlight.js";
import { createEffect, createResource } from "solid-js";
import "./a11y-dark.css";

export default function MarkdownPreview() {
  // 页面参数
  const [store, setStore] = createCachableStore({ markdown: "" });

  // Markdown内容
  const [html] = createResource(
    () => store.markdown,
    (markdown) => {
      if (markdown) {
        return parseMarkdown(markdown).catch(stringify);
      }
      return Promise.resolve("");
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
        <Card
          class="h-full w-0 flex-1"
          title="Markdown"
          operation={
            <Flex>
              <TextReadButtons value={store.markdown} />
              <TextWriteButtons
                callback={(value) => setStore("markdown", value)}
              />
            </Flex>
          }
        >
          <Editor
            value={store.markdown}
            onChange={(value) => setStore("markdown", value)}
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
      </Main>
    </Container>
  );
}
