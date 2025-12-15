import {
  convertJsonToYaml,
  convertYamlToJson,
} from "@/command/converter/json_yaml";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight } from "lucide-solid";
import { batch, createResource, createSignal, Show } from "solid-js";

export default function JsonYamlConverter() {
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
    ({ input, encode }) => {
      if (input) {
        return (
          encode ? convertJsonToYaml(input) : convertYamlToJson(input)
        ).catch((e) => e.toString());
      }
    },
  );

  return (
    <Container>
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
                  language="yaml"
                  placeholder="输入需要转换的 YAML 数据"
                />
              }
            >
              <Editor
                value={input()}
                onChange={setInput}
                language="json"
                placeholder="输入需要转换的 JSON 数据"
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
                <Editor value={output()} readOnly={true} language="json" />
              }
            >
              <Editor value={output()} readOnly={true} language="yaml" />
            </Show>
          </>,
        ]}
      />
    </Container>
  );
}
