import {
  Binary,
  CaseLower,
  CaseUpper,
  Hash,
  RefreshCcw,
  Ruler,
  Sigma,
  SquaresExclude,
} from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { generatePassword } from "@/command/generate/password";
import { CopyButton, SaveButton } from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";
import Title from "@/component/Title";

export default function PasswordGenerator() {
  const [length, setLength] = createSignal(16);
  const [uppercase, setUppercase] = createSignal(true);
  const [lowercase, setLowercase] = createSignal(true);
  const [numberic, setNumberic] = createSignal(true);
  const [special, setSpecial] = createSignal(false);
  const [size, setSize] = createSignal(10);
  const [excludes, setExcludes] = createSignal("");
  const [output, setOutput] = createSignal("");
  const [n, setN] = createSignal(0);
  createEffect(() => {
    const _ = n();
    const flag =
      size() > 0 &&
      length() > 0 &&
      (uppercase() || lowercase() || numberic() || special());
    if (flag) {
      generatePassword(
        size(),
        length(),
        lowercase(),
        uppercase(),
        numberic(),
        special(),
        excludes(),
      )
        .then((items) => setOutput(items.join("\n")))
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });
  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        <Config.Option
          label="长度"
          description="设置密码的字符长度"
          icon={() => <Ruler size={16} />}
        >
          <Config.NumberInput
            value={length()}
            onInput={setLength}
            min={1}
            max={10000}
            class="w-20"
          />
        </Config.Option>

        <Config.Option
          label="大写字符"
          description="使用大写字符 (ABCDEFGHIJKLMNOPQRSTUVWXYZ)"
          icon={() => <CaseUpper size={16} />}
        >
          <Config.Switch value={uppercase()} onChange={setUppercase} />
        </Config.Option>

        <Config.Option
          label="小写字符"
          description="使用小写字符 (abcdefghijklmnopqrstuvwxyz)"
          icon={() => <CaseLower size={16} />}
        >
          <Config.Switch value={lowercase()} onChange={setLowercase} />
        </Config.Option>

        <Config.Option
          label="数字字符"
          description="使用数字字符 (0123456789)"
          icon={() => <Binary size={16} />}
        >
          <Config.Switch value={numberic()} onChange={setNumberic} />
        </Config.Option>

        <Config.Option
          label="特殊字符"
          description="使用特殊字符 (!#$%&')*+-,:;=>?@]^_}~)"
          icon={() => <Hash size={16} />}
        >
          <Config.Switch value={special()} onChange={setSpecial} />
        </Config.Option>

        <Config.Option
          label="排除字符"
          description="设置需要排除的字符"
          icon={() => <SquaresExclude size={16} />}
        >
          <Config.Input value={excludes()} onInput={setExcludes} class="w-40" />
        </Config.Option>

        <Config.Option
          label="数量"
          description="需要生成的密码数量"
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
          <Title value="输出" />
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
