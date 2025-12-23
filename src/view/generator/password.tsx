import { generatePassword } from "@/command/generate/password";
import { TextReadButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import { createPageStore } from "@/lib/persisted";
import { stringify } from "@/lib/util";
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
import { createResource } from "solid-js";

export default function PasswordGenerator() {
  const [store, setStore] = createPageStore({
    length: 16,
    uppercase: true,
    lowercase: true,
    numeric: true,
    special: false,
    size: 10,
    excludes: "",
  });

  const [output, { refetch }] = createResource(
    () => ({ ...store }),
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
        .catch(stringify),
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
            value={store.length}
            onInput={(value) => setStore("length", value)}
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
          <Config.Switch
            value={store.uppercase}
            onChange={(value) => setStore("uppercase", value)}
          />
        </Config.Option>

        <Config.Option
          label="小写字符"
          description="使用小写字符 (abcdefghijklmnopqrstuvwxyz)"
          icon={() => <CaseLower size={16} />}
        >
          <Config.Switch
            value={store.lowercase}
            onChange={(value) => setStore("lowercase", value)}
          />
        </Config.Option>

        <Config.Option
          label="数字字符"
          description="使用数字字符 (0123456789)"
          icon={() => <Binary size={16} />}
        >
          <Config.Switch
            value={store.numeric}
            onChange={(value) => setStore("numeric", value)}
          />
        </Config.Option>

        <Config.Option
          label="特殊字符"
          description="使用特殊字符 (!#$%&')*+-,:;=>?@]^_}~)"
          icon={() => <Hash size={16} />}
        >
          <Config.Switch
            value={store.special}
            onChange={(value) => setStore("special", value)}
          />
        </Config.Option>

        <Config.Option
          label="排除字符"
          description="设置需要排除的字符"
          icon={() => <SquaresExclude size={16} />}
        >
          <Config.Input
            value={store.excludes}
            onInput={(value) => setStore("excludes", value)}
            class="w-40"
          />
        </Config.Option>

        <Config.Option
          label="数量"
          description="需要生成的密码数量"
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
