import { ArrowLeftRight, Layers } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import {
  decodeTextBase64,
  encodeTextBase64,
} from "../../command/codec/base64_text";
import {
  CopyButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import ConfigSwitch from "../../component/Config/Switch";
import Container from "../../component/Container";
import Editor from "../../component/Editor";

const BASE_MODE_OPTIONS = [
  { label: "Standard", value: "Standard" },
  { label: "StandardNoPad", value: "StandardNoPad" },
  { label: "UrlSafe", value: "UrlSafe" },
  { label: "UrlSafeNoPad", value: "UrlSafeNoPad" },
];

export default function Base64TextCodec() {
  const [mode, setMode] = createSignal("Standard");
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
      let promise;
      if (encode()) {
        promise = encodeTextBase64(input(), mode()).then(setOutput);
      } else {
        promise = decodeTextBase64(input(), mode()).then(setOutput);
      }
      promise.then(setOutput).catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });
  return (
    <div class="flex h-full flex-col gap-4">
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
            options={BASE_MODE_OPTIONS}
            onChange={setMode}
            class="w-35"
          />
        </Config.Option>
      </Config.Card>

      {/*输入*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输入</span>
          <div class="flex items-center justify-center gap-2">
            <TextOperateButtons callback={setInput} />
          </div>
        </div>
        <Editor
          value={input()}
          onChange={(value) => setInput(value)}
          placeholder={encode() ? "输入要编码的文本" : "输入要解码的文本"}
        />
      </Container>

      {/*输出*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输出</span>
          <div class="flex items-center justify-center gap-2">
            <CopyButton value={output()} />
            <SaveButton value={output()} />
          </div>
        </div>
        <Editor value={output()} language="base64" readOnly={true} />
      </Container>
    </div>
  );
}
