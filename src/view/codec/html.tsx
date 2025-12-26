import { decodeHtml, encodeHtml } from "@/command/codec/html";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { ArrowLeftRight } from "lucide-solid";
import { createResource } from "solid-js";

export default function HTMLCodec() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    input: "",
    encode: true,
  });

  // 切换操作模式
  const setEncode = (value: boolean) => {
    setStore((prev) => ({ ...prev, input: "", encode: value }));
  };

  // 获取输出
  const [output] = createResource(
    () => ({ ...store }),
    ({ input, encode }) => {
      if (input) {
        return (encode ? encodeHtml(input) : decodeHtml(input)).catch(
          stringify,
        );
      }
    },
    { initialValue: "" },
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
            on="编码"
            off="解码"
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
            placeholder={store.encode ? "输入要编码的文本" : "输入要解码的文本"}
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
