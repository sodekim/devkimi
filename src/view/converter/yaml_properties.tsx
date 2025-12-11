import {
  convertPropertiesToYaml,
  convertYamlToProperties,
} from "@/command/converter/yaml_properties";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight } from "lucide-solid";
import { batch, createEffect, createSignal, Show } from "solid-js";

export default function YamlPropertiesConverter() {
  const [encode, _setEncode] = createSignal(true);
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const setEncode = (value: boolean) => {
    batch(() => {
      setInput("");
      setOutput("");
      _setEncode(value);
    });
  };

  createEffect(() => {
    if (input().length > 0) {
      (encode()
        ? convertYamlToProperties(input())
        : convertPropertiesToYaml(input())
      )
        .then(setOutput)
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });

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
            onChange={setEncode}
            on="YAML -> PROPERTIES"
            off="PROPERTIES -> YAML"
          />
        </Config.Option>
      </Config.Card>

      <IOLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title value="输入" />
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
              <Title value="输出" />
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
