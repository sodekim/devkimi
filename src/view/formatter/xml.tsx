import { Space } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { formatXml } from "@/command/formatter/xml";
import {
  CopyButton,
  SaveButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";

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
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/*缩进配置*/}
        <Config.Option
          label="缩进"
          description="设置XML格式化的缩进方式"
          icon={() => <Space size={16} />}
        >
          <Config.Select
            value={indent()}
            options={INDENT_OPTIONS}
            onChange={setIndent}
            class="w-30"
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
              language="xml"
              placeholder="输入需要格式化的 XML 数据"
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="输出" />
              <TextReadButtons value={output()} />
            </div>
            <Editor value={output()} language="xml" readOnly={true} />
          </>,
        ]}
      />
    </Container>
  );
}
