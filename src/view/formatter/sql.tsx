import { formatSql } from "@/command/formatter/sql";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { CaseUpper, Code, Space } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

enum Indent {
  TwoSpace = "TwoSpace",
  FourSpace = "FourSpace",
  Tab = "Tab",
}

enum Dialect {
  Generic = "Generic",
  SQLServer = "SQLServer",
  PostgreSql = "PostgreSql",
}

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
            value={indent()}
            options={Object.keys(Indent)}
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
            options={Object.keys(Dialect)}
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

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={<TextWriteButtons callback={setInput} />}
        >
          <Editor
            value={input()}
            onChange={(value) => setInput(value)}
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
