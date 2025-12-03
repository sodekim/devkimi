import { createEffect, createSignal, Show } from "solid-js";
import {
  convertJsonToYaml,
  convertYamlToJson,
} from "../../command/converter/json_yaml";
import {
  CopyButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";
import { ArrowLeftRight } from "lucide-solid";

export default function JsonYamlConverter() {
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
      (mode() ? convertJsonToYaml(input()) : convertYamlToJson(input()))
        .then(setOutput)
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });

  return (
    <div class="flex size-0 h-full w-full flex-col gap-4">
      {/* 配置 */}
      <Config.Card>
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          {/*转换配置*/}
          <Config.Switch
            value={mode()}
            onChange={setMode}
            on="JSON -> YAML"
            off="YAML -> JSON"
          />
        </Config.Option>
      </Config.Card>

      <div class="flex h-0 flex-1 gap-4">
        {/*输入*/}
        <Container class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <span class="text-sm">输入</span>
            <div class="flex items-center justify-center gap-2">
              <TextOperateButtons callback={setInput} />
            </div>
          </div>
          <Show
            when={mode()}
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
        </Container>

        {/*输出*/}
        <Container class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <span class="text-sm">输出</span>
            <div class="flex items-center justify-center gap-2">
              <CopyButton value={output()} />
              <SaveButton value={output()} />
            </div>
          </div>
          <Show
            when={mode()}
            fallback={
              <Editor value={output()} readOnly={true} language="json" />
            }
          >
            <Editor value={output()} readOnly={true} language="yaml" />
          </Show>
        </Container>
      </div>
    </div>
  );
}
