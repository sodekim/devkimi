import { escapeText, unescapeText } from "@/command/text/escape";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { ArrowLeftRight } from "lucide-solid";
import { batch, createResource, createSignal } from "solid-js";

export default function TextEscape() {
  const [encode, setEncode] = createSignal(true);
  const [input, setInput] = createSignal("");
  const switchEncode = (value: boolean) => {
    batch(() => {
      setInput("");
      setEncode(value);
    });
  };

  const [output] = createResource(
    () => ({ encode: encode(), input: input() }),
    ({ encode, input }) => {
      if (input) {
        return (encode ? escapeText(input) : unescapeText(input)).catch((e) =>
          e.toString(),
        );
      }
    },
  );
  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/*操作配置*/}
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={encode()}
            onChange={switchEncode}
            on="转义"
            off="反转义"
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
            placeholder={encode() ? "输入要转义的文本" : "输入要反转义的文本"}
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
