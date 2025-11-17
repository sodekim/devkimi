import { CaseUpper, Code, Space } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { formatSql } from "../../command/formatter/sql";
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
];

const DIALECT_OPTIONS = [
  { value: "Generic", label: "标准 SQL" },
  { value: "SQLServer", label: "SQLServer" },
  { value: "PostgreSql", label: "PostgreSql" },
];

export default function SqlFormatter() {
  const [indent, setIndent] = createSignal("TwoSpace");
  const [dialect, setDialect] = createSignal("Generic");
  const [uppercase, setUppercase] = createSignal(false);
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  createEffect(() => {
    if (input().length > 0) {
      formatSql(input(), indent(), dialect(), uppercase())
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
            value={indent}
            options={INDENT_OPTIONS}
            onChange={setIndent}
            class="w-30"
          />
        </Config.Option>

        {/*语言配置*/}
        <Config.Option label="语言" icon={() => <Code size={16} />}>
          <Config.Select
            value={dialect}
            options={DIALECT_OPTIONS}
            onChange={setDialect}
            class="w-30"
          />
        </Config.Option>

        {/*关键字大写配置*/}
        <Config.Option label="关键字大写" icon={() => <CaseUpper size={16} />}>
          <Config.Switch value={uppercase} onChange={setUppercase} />
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
          value={input}
          onChange={(value) => setInput(value)}
          language="sql"
        />
      </Container>

      {/*输出*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输出</span>
          <div class="flex items-center justify-center gap-2">
            <CopyButton value={output} />
            <SaveButton value={output} />
          </div>
        </div>
        <Editor value={output} language="sql" readOnly={true} />
      </Container>
    </div>
  );
}
