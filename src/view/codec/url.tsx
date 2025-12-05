import { ArrowLeftRight } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { decodeURL, encodeURL } from "@/command/codec/url";
import {
  ClearButton,
  CopyButton,
  PasteButton,
  SaveButton,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Card from "@/component/Card";
import Editor from "@/component/Editor";
import IOLayout from "@/component/IOLayout";
import Container from "@/component/Container";

export default function UrlCodec() {
  const [encode, setEncode] = createSignal(true);
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");

  createEffect(() => {
    const _ = encode();
    setInput("");
    setOutput("");
  });

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
            onChange={setEncode}
            on="编码"
            off="解码"
          />
        </Config.Option>
      </Config.Card>

      <IOLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <span class="text-sm">输入</span>
              <div class="flex items-center justify-center gap-2">
                <PasteButton onRead={setInput} />
                <ClearButton onClick={() => setInput("")} />
              </div>
            </div>
            <Editor
              value={input()}
              onChange={setInput}
              placeholder={encode() ? "输入要编码的文本" : "输入要解码的文本"}
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <span class="text-sm">输出</span>
              <div class="flex items-center justify-center gap-2">
                <CopyButton value={output()} />
                <SaveButton value={output()} />
              </div>
            </div>
            <Editor value={output()} readOnly={true} />
          </>,
        ]}
      />
    </Container>
  );
}
