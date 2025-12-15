import { generatePassword } from "@/command/generate/password";
import { TextReadButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Title from "@/component/Title";
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
import { createResource, createSignal } from "solid-js";

export default function PasswordGenerator() {
  const [length, setLength] = createSignal(16);
  const [uppercase, setUppercase] = createSignal(true);
  const [lowercase, setLowercase] = createSignal(true);
  const [numeric, setNumeric] = createSignal(true);
  const [special, setSpecial] = createSignal(false);
  const [size, setSize] = createSignal(10);
  const [excludes, setExcludes] = createSignal("");
  const [output, { refetch }] = createResource(
    () => ({
      length: length(),
      uppercase: uppercase(),
      lowercase: lowercase(),
      numeric: numeric(),
      special: special(),
      size: size(),
      excludes: excludes(),
    }),
    ({ length, uppercase, lowercase, numeric, special, size, excludes }) =>
      generatePassword(
        size,
        length,
        lowercase,
        uppercase,
        numeric,
        special,
        excludes,
      )
        .then((passwords) => passwords.join("\n"))
        .catch((e) => e.toString()),
  );

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
          <Config.Switch value={numeric()} onChange={setNumeric} />
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
          <Title loading={output.loading}>输出</Title>
          <TextReadButtons value={output()} position="before">
            <button class="btn btn-sm" onClick={() => refetch()}>
              <RefreshCcw size={16} />
              重新生成
            </button>
          </TextReadButtons>
        </div>
        <Editor value={output()} language="plaintext" readOnly={true} />
      </Card>
    </Container>
  );
}
