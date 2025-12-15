import { ArrowLeftRight, PanelLeftRightDashed } from "lucide-solid";
import { batch, createEffect, createSignal } from "solid-js";
import {
  decryptSm2,
  encryptSm2,
  generateSm2KeyPair,
  Sm2KeyFormat,
} from "@/command/crypto/sm2";
import {
  CopyButton,
  GenerateButton,
  SaveButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import Main from "@/component/Main";

const KEY_FORMAT_OPTIONS = [
  { value: "Sec1", label: "PEM (SEC1)" },
  { value: "Pkcs8", label: "PEM (PKCS#8)" },
  { value: "Hex", label: "Hex" },
];

export default function Sm2() {
  const [encryption, _setEncryption] = createSignal(true);
  const [keyFormat, setKeyFormat] = createSignal<Sm2KeyFormat>("Sec1");
  const [privateKey, setPrivateKey] = createSignal("");
  const [publicKey, setPublicKey] = createSignal("");
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const setEncryption = (value: boolean) => {
    batch(() => {
      setInput("");
      setOutput("");
      _setEncryption(value);
    });
  };

  createEffect(() => {
    if (input().length > 0) {
      if (encryption()) {
        encryptSm2(keyFormat(), publicKey(), input())
          .then(setOutput)
          .catch((e) => setOutput(e.toString()));
      } else {
        decryptSm2(keyFormat(), privateKey(), input())
          .then(setOutput)
          .catch((e) => setOutput(e.toString()));
      }
    } else {
      setOutput("");
    }
  });

  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={encryption()}
            onChange={setEncryption}
            on="加密"
            off="解密"
          />
        </Config.Option>

        {/*密钥格式*/}
        <Config.Option
          label="密钥格式"
          description="选择私钥和公钥的编码格式"
          icon={() => <PanelLeftRightDashed size={16} />}
        >
          <Config.Select
            value={keyFormat()}
            options={KEY_FORMAT_OPTIONS}
            onChange={(value) => setKeyFormat(value as Sm2KeyFormat)}
            class="w-30"
          />
        </Config.Option>
      </Config.Card>

      {/* 密钥对 */}
      <Main class="max-h-100">
        {/*私钥*/}
        <Card
          class="h-full w-0 flex-1"
          title="私钥"
          operation={
            <TextWriteButtons callback={setPrivateKey} position="before">
              <GenerateButton
                label="生成密钥对"
                onGenerate={() =>
                  generateSm2KeyPair(keyFormat()).then(
                    ([private_key, public_key]) => {
                      setPrivateKey(private_key);
                      setPublicKey(public_key);
                    },
                  )
                }
              />
              <CopyButton value={privateKey()} />
            </TextWriteButtons>
          }
        >
          <Editor
            value={privateKey()}
            onChange={setPrivateKey}
            placeholder="输入 SM2 私钥"
          />
        </Card>

        {/*公钥*/}
        <Card
          class="h-full w-0 flex-1"
          title="公钥"
          operation={
            <TextWriteButtons callback={setPublicKey}>
              <CopyButton value={publicKey()} />
            </TextWriteButtons>
          }
        >
          <Editor
            value={publicKey()}
            onChange={setPublicKey}
            placeholder="输入 SM2 公钥"
          />
        </Card>
      </Main>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={<TextWriteButtons callback={setInput} />}
        >
          <Editor
            value={input()}
            onChange={setInput}
            placeholder={
              encryption() ? "输入需要加密的数据" : "输入需要解密的数据"
            }
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          operation={<TextReadButtons value={output()} />}
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
