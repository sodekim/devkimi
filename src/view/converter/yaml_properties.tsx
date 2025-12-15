import {
  convertPropertiesToYaml,
  convertYamlToProperties,
} from "@/command/converter/yaml_properties";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight } from "lucide-solid";
import {
  batch,
  createEffect,
  createResource,
  createSignal,
  Show,
} from "solid-js";

export default function YamlPropertiesConverter() {
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
        return (
          encode
            ? convertYamlToProperties(input)
            : convertPropertiesToYaml(input)
        ).catch((e) => e.toString());
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

      <MainLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title>输入</Title>
              <TextWriteButtons callback={setInput} />
            </div>
            <Show
              when={encode()}
              fallback={
                <Editor
                  value={input()}
                  onChange={setInput}
                  language="properties"
                  placeholder="输入需要转换的 PROPERTIES 数据"
                />
              }
            >
              <Editor
                value={input()}
                onChange={setInput}
                language="yaml"
                placeholder="输入需要转换的 YAML 数据"
              />
            </Show>
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title loading={output.loading}>输出</Title>
              <TextReadButtons value={output()} />
            </div>
            <Show
              when={encode()}
              fallback={
                <Editor value={output()} readOnly={true} language="yaml" />
              }
            >
              <Editor value={output()} readOnly={true} language="properties" />
            </Show>
          </>,
        ]}
      />
    </Container>
  );
}
