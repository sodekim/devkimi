import {
  Base64Mode,
  decodeTextBase64,
  encodeTextBase64,
} from "@/command/codec/base64";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Config from "@/component/Config";
import ConfigSwitch from "@/component/Config/Switch";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight, Layers } from "lucide-solid";
import { batch, createResource, createSignal } from "solid-js";

export default function Base64TextCodec() {
  const [mode, setMode] = createSignal<Base64Mode>(Base64Mode.Standard);
  const [input, setInput] = createSignal("");
  const [encode, _setEncode] = createSignal(true);
  const setEncode = (value: boolean) => {
    batch(() => {
      setInput("");
      _setEncode(value);
    });
  };

  const [output] = createResource(
    () => ({ input: input(), mode: mode(), encode: encode() }),
    ({ input, mode, encode }) => {
      if (input) {
        return encode
          ? encodeTextBase64(input, mode)
          : decodeTextBase64(input, mode);
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
            value={encode()}
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
            value={mode()}
            options={Object.keys(Base64Mode)}
            onChange={setMode}
            class="w-35"
          />
        </Config.Option>
      </Config.Card>

      <MainLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title value="输入" />
              <TextWriteButtons callback={setInput} />
            </div>
            <Editor
              value={input()}
              onChange={(value) => setInput(value)}
              placeholder={encode() ? "输入要编码的文本" : "输入要解码的文本"}
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="输出" />
              <TextReadButtons value={output()} />
            </div>
            <Editor
              value={output()}
              language="base64"
              readOnly={true}
              loading={output.loading}
            />
          </>,
        ]}
      />
    </Container>
  );
}
