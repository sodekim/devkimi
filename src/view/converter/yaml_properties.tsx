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
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { ArrowLeftRight } from "lucide-solid";
import { createResource, Match, Switch } from "solid-js";

export default function YamlPropertiesConverter() {
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
            value={store.encode}
            onChange={setEncode}
            on="YAML -> PROPERTIES"
            off="PROPERTIES -> YAML"
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
                language="yaml"
                placeholder="输入需要转换的 YAML 数据"
              />
            </Match>
            <Match when={decode()}>
              <Editor
                value={store.input}
                onChange={(value) => setStore("input", value)}
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
            <Match when={store.encode}>
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
