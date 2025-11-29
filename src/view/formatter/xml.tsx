import { Space } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { formatXml } from "../../command/formatter/xml";
import {
  CopyButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";

const INDENT_OPTIONS = [
  { value: "TwoSpace", label: "2个空格" },
  { value: "FourSpace", label: "4个空格" },
  { value: "Tab", label: "1个制表符" },
  { value: "None", label: "精简" },
];

export default function XmlFormatter() {
  const [indent, setIndent] = createSignal("TwoSpace");
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  createEffect(() => {
    if (input().length > 0) {
      formatXml(input(), indent())
        .then(setOutput)
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });
  return (
    <div class="flex h-full flex-col gap-4">
      {/* 配置 */}
      <Config.Card>
        {/*缩进配置*/}
        <Config.Option label="缩进" icon={() => <Space size={16} />}>
          <Config.Select
            value={indent()}
            options={INDENT_OPTIONS}
            onChange={setIndent}
            class="w-30"
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
          onChange={setInput}
          language="xml"
          placeholder="输入需要格式化的 XML 数据"
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
        <Editor value={output()} language="xml" readOnly={true} />
      </Container>
    </div>
  );
}
