import { ArrowLeftRight } from "lucide-solid";
import { createEffect, createSignal, Show } from "solid-js";
import {
  convertPropertiesToYaml,
  convertYamlToProperties,
} from "@/command/converter/yaml_properties";
import {
  CopyButton,
  SaveButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";

export default function YamlPropertiesConverter() {
  const [mode, setMode] = createSignal(true);
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");

  createEffect(() => {
    const _ = mode();
    setInput("");
    setOutput("");
  });

  createEffect(() => {
    if (input().length > 0) {
      (mode()
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
            value={mode()}
            onChange={setMode}
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
              when={mode()}
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
              when={mode()}
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
