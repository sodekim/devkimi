import {
  convertJsonToYaml,
  convertYamlToJson,
} from "@/command/converter/json_yaml";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Page from "@/component/Page";
import Editor from "@/component/Editor";
import Container from "@/component/Container";
import { stringify } from "@/lib/util";
import { ArrowLeftRight } from "lucide-solid";
import { batch, createResource, createSignal, Match, Switch } from "solid-js";

export default function JsonYamlConverter() {
  const [encode, setEncode] = createSignal(true);
  const [input, setInput] = createSignal("");
  const decode = () => !encode();
  const switchEncode = (value: boolean) => {
    batch(() => {
      setInput("");
      setEncode(value);
    });
  };

  const [output] = createResource(
    () => ({ encode: encode(), input: input() }),
    ({ input, encode }) => {
      if (input) {
        return (
          encode ? convertJsonToYaml(input) : convertYamlToJson(input)
        ).catch(stringify);
      }
    },
  );

  return (
    <Page>
      {/* 配置 */}
      <Config.Card>
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          {/*转换配置*/}
          <Config.Switch
            value={encode()}
            onChange={switchEncode}
            on="JSON -> YAML"
            off="YAML -> JSON"
          />
        </Config.Option>
      </Config.Card>

      <Container>
        <Card class="h-full w-0 flex-1" title="输入" operation={<TextWriteButtons callback={setInput} />}>
          <Switch>
            <Match when={encode()}>
              <Editor
                value={input()}
                onChange={setInput}
                language="json"
                placeholder="输入需要转换的 JSON 数据"
              />
            </Match>
            <Match when={decode()}>
              <Editor
                value={input()}
                onChange={setInput}
                language="yaml"
                placeholder="输入需要转换的 YAML 数据"
              />
            </Match>
          </Switch>
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          operation={<TextReadButtons value={output()} />}
          loading={output.loading}
        >
          <Switch>
            <Match when={encode()}>
              <Editor value={output()} readOnly={true} language="yaml" />
            </Match>
            <Match when={decode()}>
              <Editor value={output()} readOnly={true} language="json" />
            </Match>
          </Switch>
        </Card>
      </Container>
    </Page>
  );
}
