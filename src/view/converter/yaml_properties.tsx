import {
  convertPropertiesToYaml,
  convertYamlToProperties,
} from "@/command/converter/yaml_properties";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { stringify } from "@/lib/util";
import { ArrowLeftRight } from "lucide-solid";
import {
  batch,
  createResource,
  createSignal,
  Match,
  Switch
} from "solid-js";

export default function YamlPropertiesConverter() {
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
    ({ encode, input }) => {
      if (input) {
        return (
          encode
            ? convertYamlToProperties(input)
            : convertPropertiesToYaml(input)
        ).catch(stringify);
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
          {/*转换配置*/}
          <Config.Switch
            value={encode()}
            onChange={switchEncode}
            on="YAML -> PROPERTIES"
            off="PROPERTIES -> YAML"
          />
        </Config.Option>
      </Config.Card>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={<TextWriteButtons callback={setInput} />}
        >
          <Switch>
            <Match when={encode()}>
              <Editor
                value={input()}
                onChange={setInput}
                language="yaml"
                placeholder="输入需要转换的 YAML 数据"
              />
            </Match>
            <Match when={decode()}>
              <Editor
                value={input()}
                onChange={setInput}
                language="properties"
                placeholder="输入需要转换的 PROPERTIES 数据"
              />
            </Match>
          </Switch>
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          operation={<TextReadButtons value={output()} />}
        >
          <Switch>
            <Match when={encode()}>
              <Editor value={output()} readOnly={true} language="properties" />
            </Match>
            <Match when={decode()}>
              <Editor value={output()} readOnly={true} language="yaml" />
            </Match>
          </Switch>
        </Card>
      </Main>
    </Container>
  );
}
