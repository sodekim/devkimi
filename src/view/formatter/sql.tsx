import { formatSql } from "@/command/formatter/sql";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createPageStore } from "@/lib/persisted";
import { CaseUpper, Code, Space } from "lucide-solid";
import { createResource } from "solid-js";

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
  const [store, setStore] = createPageStore({
    indent: Indent.TwoSpace,
    dialect: Dialect.Generic,
    uppercase: false,
    input: "",
  });

  const [output] = createResource(
    () => ({ ...store }),
    ({ indent, dialect, uppercase, input }) => {
      if (input) {
        return formatSql(input, indent, dialect, uppercase).catch((e) =>
          e.toString(),
        );
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
          description="设置SQL格式化的缩进方式"
          icon={() => <Space size={16} />}
        >
          <Config.Select
            value={store.indent}
            options={INDENT_OPTIONS}
            onChange={(value) => setStore("indent", value)}
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
            value={store.dialect}
            options={DIALECT_OPTIONS}
            onChange={(value) => setStore("dialect", value)}
            class="w-30"
          />
        </Config.Option>

        {/*关键字大写配置*/}
        <Config.Option
          label="关键字大写"
          description="将SQL关键字转为大写格式"
          icon={() => <CaseUpper size={16} />}
        >
          <Config.Switch
            value={store.uppercase}
            onChange={(value) => setStore("uppercase", value)}
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
            language="sql"
            placeholder="输入需要格式化的 SQL 语句"
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} language="sql" readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
