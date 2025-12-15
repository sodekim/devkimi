import { decodeHtml, encodeHtml } from "@/command/codec/html";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight } from "lucide-solid";
import { batch, createResource, createSignal } from "solid-js";

export default function HTMLCodec() {
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
    () => ({ input: input(), encode: encode() }),
    ({ input, encode }) => {
      if (input) {
        return (encode ? encodeHtml(input) : decodeHtml(input)).catch((e) => e.toString());
      }
    },
    { initialValue: "" }
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
            value={encode()}
            onChange={switchEncode}
            on="编码"
            off="解码"
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
              onChange={setInput}
              placeholder={encode() ? "输入要编码的文本" : "输入要解码的文本"}
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="输出" />
              <TextReadButtons value={output()} />
            </div>
            <Editor value={output()} readOnly={true} loading={output.loading} />
          </>,
        ]}
      />
    </Container>
  );
}
