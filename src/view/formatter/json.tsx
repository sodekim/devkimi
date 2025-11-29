import { ArrowDownAZ, Space } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { formatJson } from "../../command/formatter/json";
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

export default function JsonFormatter() {
  const [indent, setIndent] = createSignal("TwoSpace");
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

        {/*排序配置*/}
        <Config.Option
          label="排序"
          description="按照字符顺序排序 JSON 属性"
          icon={() => <ArrowDownAZ size={16} />}
        >
          <Config.Switch value={sortable()} onChange={setSortable} />
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
          onChange={(value) => {
            console.log(value);
            setInput(value);
          }}
          language="json"
          placeholder="输入需要格式化的 JSON 数据"
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
        <Editor value={output()} language="json" readOnly={true} />
      </Container>
    </div>
  );
}
