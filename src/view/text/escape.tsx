import { escapeText, unescapeText } from "@/command/text/escape";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { ArrowLeftRight } from "lucide-solid";
import { createResource } from "solid-js";

export default function TextEscape() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    encode: true,
    input: "",
  });

  // 是否转义
  const setEncode = (value: boolean) => setStore({ encode: value, input: "" });

  // 输出结果
  const [output] = createResource(
    () => ({ ...store }),
    ({ encode, input }) => {
      if (input) {
        return (encode ? escapeText(input) : unescapeText(input)).catch((e) =>
          e.toString(),
        );
      }
    },
  );
  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/*操作配置*/}
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={store.encode}
            onChange={setEncode}
            on="转义"
            off="反转义"
          />
        </Config.Option>
      </Config.Card>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={
            <TextWriteButtons callback={(value) => setStore("input", value)} />
          }
        >
          <Editor
            value={store.input}
            onChange={(value) => setStore("input", value)}
            placeholder={
              store.encode ? "输入要转义的文本" : "输入要反转义的文本"
            }
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
