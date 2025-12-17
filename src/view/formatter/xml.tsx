import { formatXml } from "@/command/formatter/xml";
import Card, {
  readTextOperations,
  writeTextOperations,
} from "@/component/Card";
import Config from "@/component/Config";
import Editor from "@/component/Editor";
import Container from "@/component/Container";
import Page from "@/component/Page";
import { stringify } from "@/lib/util";
import { Space } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

enum Indent {
  TwoSpace = "TwoSpace",
  FourSpace = "FourSpace",
  Tab = "Tab",
  None = "None",
}

const INDENT_OPTIONS = [
  { label: "2个空格", value: Indent.TwoSpace },
  { label: "4个空格", value: Indent.FourSpace },
  { label: "1个制表符", value: Indent.Tab },
  { label: "无缩进", value: Indent.None },
];

export default function XmlFormatter() {
  const [indent, setIndent] = createSignal(Indent.TwoSpace);
  const [input, setInput] = createSignal("");
  const [output] = createResource(
    () => ({ indent: indent(), input: input() }),
    ({ indent, input }) => {
      if (input) {
        return formatXml(input, indent).catch(stringify);
      }
    },
  );

  return (
    <Page>
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

      <Container>
        <Card
          class="h-full"
          title="输入"
          operation={writeTextOperations(setInput)}
        >
          <Editor
            value={input()}
            onChange={setInput}
            language="xml"
            placeholder="输入需要格式化的 XML 数据"
          />
        </Card>
        <Card
          class="h-full"
          title="输出"
          loading={output.loading}
          operation={readTextOperations(() => output())}
        >
          <Editor value={output()} language="xml" readOnly={true} />
        </Card>
      </Container>
    </Page>
  );
}
