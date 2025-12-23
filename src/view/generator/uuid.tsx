import { generateUuid } from "@/command/generate/uuid";
import { TextReadButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import ConfigSwitch from "@/component/Config/Switch";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import { createPageStore } from "@/lib/persisted";
import { stringify } from "@/lib/util";
import { CaseUpper, Minus, RefreshCcw, Settings2, Sigma } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

enum Version {
  V1 = "V1",
  V4 = "V4",
  V7 = "V7",
}

export default function UuidGenerator() {
  const [store, setStore] = createPageStore({ version: Version.V4, uppercase: false, hyphen: true, size: 10 });

  const [output, { refetch }] = createResource(
    () => ({ ...store }),
    ({ version, uppercase, hyphen, size }) =>
      generateUuid(size, version, hyphen, uppercase)
        .then((uuids) => uuids.join("\n"))
        .catch(stringify),
  );
  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/*版本配置*/}
        <Config.Option
          label="版本"
          description="选择生成UUID的版本"
          icon={() => <Settings2 size={16} />}
        >
          <Config.Select
            value={store.version}
            options={Object.keys(Version)}
            onChange={(value) => setStore("version", value)}
            class="w-20"
          />
        </Config.Option>

        {/*连字符配置*/}
        <Config.Option
          label="连字符"
          description="在UUID中添加连字符分隔"
          icon={() => <Minus size={16} />}
        >
          <ConfigSwitch
            value={store.hyphen}
            onChange={(value) => setStore("hyphen", value)}
          />
        </Config.Option>

        {/*大写字符配置*/}
        <Config.Option
          label="大写字符"
          description="使用大写字母输出UUID"
          icon={() => <CaseUpper size={16} />}
        >
          <ConfigSwitch
            value={store.uppercase}
            onChange={(value) => setStore("uppercase", value)}
          />
        </Config.Option>

        {/*数量配置*/}
        <Config.Option
          label="数量"
          description="需要生成的UUID数量"
          icon={() => <Sigma size={16} />}
        >
          <Config.NumberInput
            value={store.size}
            onInput={(value) => setStore("size", value)}
            min={1}
            max={10000}
            class="w-20"
          />
        </Config.Option>
      </Config.Card>

      {/*输出*/}
      <Card
        class="h-0 flex-1"
        title="输出"
        loading={output.loading}
        operation={
          <TextReadButtons value={output()} position="before">
            <button class="btn btn-sm" onClick={() => refetch()}>
              <RefreshCcw size={16} />
              重新生成
            </button>
          </TextReadButtons>
        }
      >
        <Editor value={output()} language="plaintext" readOnly={true} />
      </Card>
    </Container>
  );
}
