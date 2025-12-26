import {
  convertJsonToYaml,
  convertYamlToJson,
} from "@/command/converter/json_yaml";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { ArrowLeftRight } from "lucide-solid";
import { createResource, Match, Switch } from "solid-js";

export default function JsonYamlConverter() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    encode: true,
    input: "",
  });

  // 是否解码
  const decode = () => !store.encode;

  // 切换操作模式
  const setEncode = (value: boolean) => {
    setStore({ encode: value, input: "" });
  };

  // 输出结果
  const [output] = createResource(
    () => ({ ...store }),
    ({ input, encode }) => {
      if (input) {
        return (
          encode ? convertJsonToYaml(input) : convertYamlToJson(input)
        ).catch(stringify);
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
            value={store.encode}
            onChange={setEncode}
            on="JSON -> YAML"
            off="YAML -> JSON"
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
          <Switch>
            <Match when={store.encode}>
              <Editor
                value={store.input}
                onChange={(value) => setStore("input", value)}
                language="json"
                placeholder="输入需要转换的 JSON 数据"
              />
            </Match>
            <Match when={decode()}>
              <Editor
                value={store.input}
                onChange={(value) => setStore("input", value)}
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
            <Match when={store.encode}>
              <Editor value={output()} readOnly={true} language="yaml" />
            </Match>
            <Match when={decode()}>
              <Editor value={output()} readOnly={true} language="json" />
            </Match>
          </Switch>
        </Card>
      </Main>
    </Container>
  );
}
