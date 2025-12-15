import { formatXml } from "@/command/formatter/xml";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { stringify } from "@/lib/util";
import { Space } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

enum Indent {
  TwoSpace = "TwoSpace",
  FourSpace = "FourSpace",
  Tab = "Tab",
  None = "None",
}

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
            options={Object.keys(Indent)}
            onChange={setIndent}
            class="w-30"
          />
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
            onChange={setInput}
            language="xml"
            placeholder="输入需要格式化的 XML 数据"
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} language="xml" readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
