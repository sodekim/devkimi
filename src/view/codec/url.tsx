import { decodeURL, encodeURL } from "@/command/codec/url";
import {
  TextReadButtons,
  TextWriteButtons
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight } from "lucide-solid";
import { batch, createEffect, createSignal } from "solid-js";

export default function UrlCodec() {
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const [encode, _setEnocde] = createSignal(true);
  const setEnocde = (value: boolean) => {
    batch(() => {
      setInput("");
      setOutput("");
      _setEnocde(value);
    });
  };

  createEffect(() => {
    if (input().length > 0) {
      (encode() ? encodeURL(input()) : decodeURL(input()))
        .then(setOutput)
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });
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
            onChange={setEnocde}
            on="编码"
            off="解码"
          />
        </Config.Option>
      </Config.Card>

      <IOLayout
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
            <Editor value={output()} readOnly={true} />
          </>,
        ]}
      />
    </Container>
  );
}
