import { ArrowDownAZ, Space } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { formatJson, Ident } from "@/command/formatter/json";
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
  { value: Ident.TwoSpace, label: "2个空格" },
  { value: Ident.FourSpace, label: "4个空格" },
  { value: Ident.Tab, label: "1个制表符" },
  { value: Ident.None, label: "精简" },
];

export default function JsonFormatter() {
  const [indent, setIndent] = createSignal<Ident>(Ident.TwoSpace);
  const [sortable, setSortable] = createSignal(false);
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  createEffect(() => {
    if (input().length > 0) {
      formatJson(input(), indent(), sortable())
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
          description="设置JSON格式化的缩进方式"
          icon={() => <Space size={16} />}
        >
          <Config.Select
            value={indent()}
            options={INDENT_OPTIONS}
            onChange={setIndent}
            class="w-30"
          />
        </Config.Option>

        {/*排序配置*/}
        <Config.Option
          label="排序"
          description="按照字符顺序排序 JSON 属性"
          icon={() => <ArrowDownAZ size={16} />}
        >
          <Config.Switch value={sortable()} onChange={setSortable} />
        </Config.Option>
      </Config.Card>

      <IOLayout
        items={[
          <>
            {" "}
            <div class="flex items-center justify-between">
              <Title value="输入" />
              <TextWriteButtons callback={setInput} />
            </div>
            <Editor
              value={input()}
              onChange={(value) => {
                console.log(value);
                setInput(value);
              }}
              language="json"
              placeholder="输入需要格式化的 JSON 数据"
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="输出" />
              <TextReadButtons value={output()} />
            </div>
            <Editor value={output()} language="json" readOnly={true} />
          </>,
        ]}
      />
    </Container>
  );
}
