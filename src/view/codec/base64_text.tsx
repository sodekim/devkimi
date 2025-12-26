import {
  Base64Mode,
  decodeTextBase64,
  encodeTextBase64,
} from "@/command/codec/base64";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import ConfigSwitch from "@/component/Config/Switch";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { ArrowLeftRight, Layers } from "lucide-solid";
import { createResource } from "solid-js";

export default function Base64TextCodec() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    input: "",
    mode: Base64Mode.Standard,
    encode: true,
  });

  // 切换操作模式
  const setEncode = (value: boolean) => {
    setStore((prev) => ({ ...prev, input: "", encode: value }));
  };

  // 获取输出
  const [output] = createResource(
    () => ({ ...store }),
    ({ input, mode, encode }) => {
      if (input) {
        return (
          encode ? encodeTextBase64(input, mode) : decodeTextBase64(input, mode)
        ).catch(stringify);
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
          <ConfigSwitch
            value={store.encode}
            onChange={setEncode}
            on="编码"
            off="解码"
          />
        </Config.Option>

        {/*模式配置*/}
        <Config.Option
          label="模式"
          description="选择Bas64的模式"
          icon={() => <Layers size={16} />}
        >
          <Config.Select
            value={store.mode}
            options={Object.keys(Base64Mode)}
            onChange={(value) => setStore("mode", value)}
            class="w-35"
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
          loading={output.loading}
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
