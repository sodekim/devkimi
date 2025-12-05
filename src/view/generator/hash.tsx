import {
  CaseUpper,
  CircleCheckBig,
  CircleX,
  Paperclip,
  Settings2,
} from "lucide-solid";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";
import { generateFileHash, generateTextHash } from "@/command/generate/hash";
import {
  ClearButton,
  CopyButton,
  PasteButton,
  PickFileButton,
  SaveButton,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";

const HASH_ALGORITHM_OPTIONS = [
  { value: "Fsb160", label: "FSB-160" },
  { value: "Fsb224", label: "FSB-224" },
  { value: "Fsb256", label: "FSB-256" },
  { value: "Fsb384", label: "FSB-384" },
  { value: "Fsb512", label: "FSB-512" },
  { value: "Md2", label: "MD2" },
  { value: "Md4", label: "MD4" },
  { value: "Md5", label: "MD5" },
  { value: "Sm3", label: "SM3" },
  { value: "Sha1", label: "SHA-1" },
  { value: "Sha224", label: "SHA-224" },
  { value: "Sha256", label: "SHA-256" },
  { value: "Sha384", label: "SHA-384" },
  { value: "Sha512", label: "SHA-512" },
  { value: "Sha3_224", label: "SHA3-224" },
  { value: "Sha3_256", label: "SHA3-256" },
  { value: "Sha3_384", label: "SHA3-384" },
  { value: "Sha3_512", label: "SHA3-512" },
];

export default function HashGenerator() {
  const [text, setText] = createSignal("");
  const [file, setFile] = createSignal("");
  const [algorithm, setAlgorithm] = createSignal("Md5");
  const [uppercase, setUppercase] = createSignal(false);
  const [output, setOutput] = createSignal("");
  const [target, setTarget] = createSignal("");
  const matched = () => target().toLowerCase() === output().toLowerCase();
  const [mode, setMode] = createSignal(true);
  createEffect(() => {
    const _ = file();
    setMode(false);
  });
  createEffect(() => {
    const _ = text();
    setMode(true);
  });
  createEffect(() => {
    console.log("mode: " + mode());
    (mode()
      ? generateTextHash(text(), algorithm(), uppercase())
      : generateFileHash(file(), algorithm(), uppercase())
    )
      .then(setOutput)
      .catch((e) => setOutput(e.toString()));
  });
  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/*版本配置*/}
        <Config.Option
          label="算法"
          description="选择使用的哈希算法"
          icon={() => <Settings2 size={16} />}
        >
          <Config.Select
            value={algorithm()}
            options={HASH_ALGORITHM_OPTIONS}
            onChange={setAlgorithm}
            class="w-40"
          />
        </Config.Option>

        {/*大写字符配置*/}
        <Config.Option
          label="大写字符"
          description="使用大写字母输出哈希值"
          icon={() => <CaseUpper size={16} />}
        >
          <Config.Switch value={uppercase()} onChange={setUppercase} />
        </Config.Option>
      </Config.Card>

      {/*输入*/}
      <Card>
        <div class="tabs tabs-border gap-2">
          {/*文本*/}
          <input
            type="radio"
            name="input_type"
            class="tab"
            aria-label="文本"
            checked={true}
          />
          <div class="tab-content">
            <div class="flex h-30 flex-col gap-2">
              <div class="flex items-center justify-end gap-2">
                <PasteButton onRead={setText} />
                <ClearButton onClick={() => setText("")} />
              </div>
              <Editor
                value={text()}
                onChange={setText}
                placeholder="输入要计算哈希值的文本"
              />
            </div>
          </div>

          {/*文件*/}
          <input type="radio" name="input_type" class="tab" aria-label="文件" />
          <div class="tab-content gap-2">
            <div class="flex h-30 flex-col gap-2">
              <div class="flex items-center justify-end gap-2">
                <PickFileButton onPick={(file) => file && setFile(file)} />
              </div>
              <div class="border-base-content/20 flex h-full flex-col items-center justify-center gap-2 rounded-md border">
                <span
                  class={twMerge(
                    "flex items-center justify-center gap-1 text-sm",
                    file() ? "text-primary" : "text-warning",
                  )}
                >
                  <Paperclip size={14} />
                  {file() || "选择需要计算哈希值的文件"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/*哈希值*/}
      <Card>
        <div class="flex items-center justify-between">
          <span class="text-sm">哈希值</span>
          <div class="flex items-center justify-center gap-2">
            <CopyButton value={output()} />
            <SaveButton value={output()} />
          </div>
        </div>
        <input
          class="input input-md w-full outline-none"
          value={output()}
          readOnly={true}
        />
      </Card>

      {/*校验哈希值*/}
      <Card>
        <div class="flex items-center justify-between">
          <span class="flex items-center justify-center gap-4 text-sm">
            校验哈希值
            <Show when={target()}>
              <Switch>
                <Match when={matched()}>
                  <span class="flex items-center justify-center gap-1 text-sm">
                    <CircleCheckBig size={16} color="var(--color-success)" />
                    哈希值匹配
                  </span>
                </Match>
                <Match when={!matched()}>
                  <span class="flex items-center justify-center gap-1 text-sm">
                    <CircleX size={16} color="var(--color-error)" />
                    哈希值不匹配
                  </span>
                </Match>
              </Switch>
            </Show>
          </span>
          <div class="flex items-center justify-center gap-2">
            <PasteButton onRead={setTarget} />
          </div>
        </div>
        <input
          class="input input-md w-full outline-none"
          value={target()}
          onInput={(e) => setTarget(e.target.value)}
          placeholder="输入要校验的哈希值即可与结果进行比对"
        />
      </Card>
    </Container>
  );
}
