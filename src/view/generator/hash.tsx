import { generateFileHash, generateTextHash } from "@/command/generate/hash";
import {
  ClearButton,
  PasteButton,
  PickFileButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import { stringify } from "@/lib/util";
import {
  CaseUpper,
  CircleCheckBig,
  CircleX,
  Paperclip,
  Settings2,
} from "lucide-solid";
import { createResource, createSignal, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";

enum HashAlgorithm {
  Fsb160 = "Fsb160",
  Fsb224 = "Fsb224",
  Fsb256 = "Fsb256",
  Fsb384 = "Fsb384",
  Fsb512 = "Fsb512",
  Md2 = "Md2",
  Md4 = "Md4",
  Md5 = "Md5",
  Sm3 = "Sm3",
  Sha1 = "Sha1",
  Sha224 = "Sha224",
  Sha256 = "Sha256",
  Sha384 = "Sha384",
  Sha512 = "Sha512",
  Sha3_224 = "Sha3_224",
  Sha3_256 = "Sha3_256",
  Sha3_384 = "Sha3_384",
  Sha3_512 = "Sha3_512",
}

enum Mode {
  Text,
  File,
}

type Input = { value: string; mode: Mode };

export default function HashGenerator() {
  const [input, setInput] = createSignal<Input>({ value: "", mode: Mode.Text });
  const [algorithm, setAlgorithm] = createSignal(HashAlgorithm.Md5);
  const [uppercase, setUppercase] = createSignal(false);
  const [target, setTarget] = createSignal("");
  const matched = () => target().toLowerCase() === output().toLowerCase();
  const [output] = createResource(
    () => ({
      input: input(),
      algorithm: algorithm(),
      uppercase: uppercase(),
    }),
    ({ input, algorithm, uppercase }) => {
      return (input.mode === Mode.Text ? generateTextHash : generateFileHash)(
        input.value,
        algorithm,
        uppercase,
      ).catch(stringify);
    },
    { initialValue: "" },
  );
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
            options={Object.keys(HashAlgorithm)}
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
                <PasteButton
                  onRead={(value) => setInput({ value, mode: Mode.Text })}
                />
                <ClearButton
                  onClick={() => setInput({ value: "", mode: Mode.Text })}
                />
              </div>
              <Editor
                value={input().mode === Mode.Text ? input().value : ""}
                onChange={(value) => setInput({ value, mode: Mode.Text })}
                placeholder="输入要计算哈希值的文本"
              />
            </div>
          </div>

          {/*文件*/}
          <input type="radio" name="input_type" class="tab" aria-label="文件" />
          <div class="tab-content gap-2">
            <div class="flex h-30 flex-col gap-2">
              <div class="flex items-center justify-end gap-2">
                <PickFileButton
                  onPick={(file) =>
                    file && setInput({ value: file, mode: Mode.File })
                  }
                />
              </div>
              <div class="border-base-content/15 flex h-full flex-col items-center justify-center gap-2 rounded-md border">
                <span
                  class={twMerge(
                    "flex items-center justify-center gap-1 text-sm",
                    input().mode === Mode.File && input().value
                      ? "text-primary"
                      : "text-warning",
                  )}
                >
                  <Paperclip size={14} />
                  {(input().mode === Mode.Text ? "" : input().value) ||
                    "选择需要计算哈希值的文件"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/*哈希值*/}
      <Card
        title="哈希值"
        loading={output.loading}
        operation={<TextReadButtons value={output()} />}
      >
        <input
          class="input input-md w-full font-mono font-bold outline-none"
          value={output() || ""}
          readOnly={true}
        />
      </Card>

      {/*校验哈希值*/}
      <Card
        title="校验哈希值"
        operation={<TextWriteButtons callback={setTarget} />}
        notification={
          <Show when={target()}>
            <Switch>
              <Match when={matched()}>
                <span class="flex items-center justify-center gap-1 text-sm">
                  <CircleCheckBig size={16} color="var(--color-success)" />
                  校验成功
                </span>
              </Match>
              <Match when={!matched()}>
                <span class="flex items-center justify-center gap-1 text-sm">
                  <CircleX size={16} color="var(--color-error)" />
                  校验失败
                </span>
              </Match>
            </Switch>
          </Show>
        }
      >
        <input
          class="input input-md w-full font-mono font-bold outline-none"
          value={target()}
          onInput={(e) => setTarget(e.target.value)}
          placeholder="输入要校验的哈希值即可与结果进行比对"
        />
      </Card>
    </Container>
  );
}
