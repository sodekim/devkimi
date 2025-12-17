import { formatSql } from "@/command/formatter/sql";
import Card, {
  readTextOperations,
  writeTextOperations,
} from "@/component/Card";
import Config from "@/component/Config";
import Editor from "@/component/Editor";
import Container from "@/component/Container";
import Page from "@/component/Page";
import Splitter from "@/component/Splitter";
import { CaseUpper, Code, Space } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

enum Indent {
  TwoSpace = "TwoSpace",
  FourSpace = "FourSpace",
  Tab = "Tab",
}

const INDENT_OPTIONS = [
  { label: "2个空格", value: Indent.TwoSpace },
  { label: "4个空格", value: Indent.FourSpace },
  { label: "1个制表符", value: Indent.Tab },
];

enum Dialect {
  Generic = "Generic",
  SQLServer = "SQLServer",
  PostgreSql = "PostgreSql",
}

const DIALECT_OPTIONS = [
  { label: "标准", value: Dialect.Generic },
  { label: "SQLServer", value: Dialect.SQLServer },
  { label: "PostgreSQL", value: Dialect.PostgreSql },
];

export default function SqlFormatter() {
  const [indent, setIndent] = createSignal(Indent.TwoSpace);
  const [dialect, setDialect] = createSignal(Dialect.Generic);
  const [uppercase, setUppercase] = createSignal(false);
  const [input, setInput] = createSignal("");

  const [output] = createResource(
    () => ({
      ident: indent(),
      dialect: dialect(),
      uppercase: uppercase(),
      input: input(),
    }),
    ({ ident, dialect, uppercase, input }) => {
      if (input) {
        return formatSql(input, ident, dialect, uppercase).catch((e) =>
          e.toString(),
        );
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
          description="设置SQL格式化的缩进方式"
          icon={() => <Space size={16} />}
        >
          <Config.Select
            value={indent()}
            options={INDENT_OPTIONS}
            onChange={setIndent}
            class="w-30"
          />
        </Config.Option>

        {/*语言配置*/}
        <Config.Option
          label="语言"
          description="选择SQL方言类型"
          icon={() => <Code size={16} />}
        >
          <Config.Select
            value={dialect()}
            options={DIALECT_OPTIONS}
            onChange={setDialect}
            class="w-30"
          />
        </Config.Option>

        {/*关键字大写配置*/}
        <Config.Option
          label="关键字大写"
          description="将SQL关键字转为大写格式"
          icon={() => <CaseUpper size={16} />}
        >
          <Config.Switch value={uppercase()} onChange={setUppercase} />
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
            language="sql"
            placeholder="输入需要格式化的 SQL 语句"
          />
        </Card>
        <Card
          class="h-full"
          title="输出"
          loading={output.loading}
          operation={readTextOperations(() => output())}
        >
          <Editor value={output()} language="sql" readOnly={true} />
        </Card>
      </Container>
    </Page>
  );
}
