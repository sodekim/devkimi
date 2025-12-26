import { formatXml } from "@/command/formatter/xml";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { Space } from "lucide-solid";
import { createResource } from "solid-js";

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
  // 页面参数
  const [store, setStore] = createCachableStore({
    indent: Indent.TwoSpace,
    input: "",
  });

  // 输出结果
  const [output] = createResource(
    () => ({ ...store }),
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
            value={store.indent}
            options={INDENT_OPTIONS}
            onChange={(value) => setStore("indent", value)}
            class="w-30"
          />
        </Config.Option>
      </Config.Card>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={
            <TextWriteButtons callback={(value) => setStore("input", value)} />
          }
        >
          <Editor
            value={store.input}
            onChange={(value) => setStore("input", value)}
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
