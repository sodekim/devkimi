import {
  Base64Mode,
  decodeTextBase64,
  encodeTextBase64,
} from "@/command/codec/base64";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import ConfigSwitch from "@/component/Config/Switch";
import Page from "@/component/Page";
import Editor from "@/component/Editor";
import Container from "@/component/Container";
import { stringify } from "@/lib/util";
import { ArrowLeftRight, Layers } from "lucide-solid";
import { batch, createResource, createSignal } from "solid-js";

export default function Base64TextCodec() {
  const [mode, setMode] = createSignal<Base64Mode>(Base64Mode.Standard);
  const [input, setInput] = createSignal("");
  const [encode, setEncode] = createSignal(true);

  // 切换操作模式
  const switchEncode = (value: boolean) => {
    batch(() => {
      setInput("");
      setEncode(value);
    });
  };

  // 获取输出
  const [output] = createResource(
    () => ({ input: input(), mode: mode(), encode: encode() }),
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
    <Page>
      {/* 配置 */}
      <Config.Card>
        {/*操作配置*/}
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <ConfigSwitch
            value={encode()}
            onChange={switchEncode}
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
            value={mode()}
            options={Object.keys(Base64Mode)}
            onChange={setMode}
            class="w-35"
          />
        </Config.Option>
      </Config.Card>

      <Container>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={<TextWriteButtons callback={setInput} />}
        >
          <Editor
            value={input()}
            onChange={setInput}
            placeholder={encode() ? "输入要编码的文本" : "输入要解码的文本"}
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
      </Container>
    </Page>
  );
}
