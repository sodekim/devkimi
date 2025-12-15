import { formatJson } from "@/command/formatter/json";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Main from "@/component/Main";
import Title from "@/component/Title";
import { stringify } from "@/lib/util";
import { ArrowDownAZ, Space } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

enum Indent {
  TwoSpace = "TwoSpace",
  FourSpace = "FourSpace",
  Tab = "Tab",
  None = "None",
}

export default function JsonFormatter() {
  const [indent, setIndent] = createSignal(Indent.TwoSpace);
  const [sortable, setSortable] = createSignal(false);
  const [input, setInput] = createSignal("");

  const [output] = createResource(
    () => ({
      indent: indent(),
      sortable: sortable(),
      input: input(),
    }),
    ({ indent, sortable, input }) => {
      if (input) {
        return formatJson(input, indent, sortable).catch(stringify);
      }
    },
  );

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
            options={Object.keys(Indent)}
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

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={<TextWriteButtons callback={setInput} />}
        >
          <Editor
            value={input()}
            onChange={(value) => {
              console.log(value);
              setInput(value);
            }}
            language="json"
            placeholder="输入需要格式化的 JSON 数据"
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} language="json" readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
