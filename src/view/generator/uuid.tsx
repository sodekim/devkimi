import { CaseUpper, Minus, RefreshCcw, Settings2, Sigma } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { generateUuid } from "@/command/generate/uuid";
import { CopyButton, SaveButton } from "@/component/Buttons";
import Config from "@/component/Config";
import ConfigSwitch from "@/component/Config/Switch";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";

const UUID_VERSION_OPTIONS = [
  { value: "V1", label: "v1" },
  { value: "V4", label: "v4" },
  { value: "V7", label: "v7" },
];

export default function UuidGenerator() {
  const [version, setVersion] = createSignal("V4");
  const [uppercase, setUppercase] = createSignal(false);
  const [hyphen, setHyphen] = createSignal(true);
  const [size, setSize] = createSignal(10);
  const [output, setOutput] = createSignal("");
  const [n, setN] = createSignal(0);
  createEffect(() => {
    const _ = n();
    generateUuid(size(), version(), hyphen(), uppercase())
      .then((items) => setOutput(items.join("\n")))
      .catch((e) => setOutput(e.toString()));
  });
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
            value={version()}
            options={UUID_VERSION_OPTIONS}
            onChange={setVersion}
            class="w-20"
          />
        </Config.Option>

        {/*连字符配置*/}
        <Config.Option
          label="连字符"
          description="在UUID中添加连字符分隔"
          icon={() => <Minus size={16} />}
        >
          <ConfigSwitch value={hyphen()} onChange={setHyphen} />
        </Config.Option>

        {/*大写字符配置*/}
        <Config.Option
          label="大写字符"
          description="使用大写字母输出UUID"
          icon={() => <CaseUpper size={16} />}
        >
          <ConfigSwitch value={uppercase()} onChange={setUppercase} />
        </Config.Option>

        {/*数量配置*/}
        <Config.Option
          label="数量"
          description="需要生成的UUID数量"
          icon={() => <Sigma size={16} />}
        >
          <Config.NumberInput
            value={size()}
            onInput={setSize}
            min={1}
            max={10000}
            class="w-20"
          />
        </Config.Option>
      </Config.Card>

      {/*输出*/}
      <Card class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输出</span>
          <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm" onClick={() => setN(n() + 1)}>
              <RefreshCcw size={16} />
              重新生成
            </button>
            <CopyButton value={output()} />
            <SaveButton value={output()} />
          </div>
        </div>
        <Editor value={output()} language="plaintext" readOnly={true} />
      </Card>
    </Container>
  );
}
