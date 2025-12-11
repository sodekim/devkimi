import {
  decryptRsa,
  encryptRsa,
  generateRsaKeyPair,
} from "@/command/crypto/rsa";
import { KeyFormat } from "@/command/crypto/type";
import {
  CopyButton,
  GenerateButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight, PanelLeftRightDashed, Ruler } from "lucide-solid";
import { batch, createEffect, createSignal } from "solid-js";

const KEY_FORMAT_OPTIONS = [
  { value: "Pkcs8", label: "PKCS#8" },
  { value: "Pkcs1", label: "PKCS#1" },
];

const BIT_SIZE_OPTIONS = [
  { value: 1024, label: "1024" },
  { value: 2048, label: "2048" },
  { value: 3072, label: "3072" },
  { value: 4096, label: "4096" },
];

export default function Rsa() {
  const [encryption, _setEncryption] = createSignal(true);
  const [keyFormat, setKeyFormat] = createSignal<KeyFormat>(KeyFormat.Pkcs8);
  const [bitSize, setBitSize] = createSignal(1024);
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
        encryptRsa(keyFormat(), publicKey(), input())
          .then(setOutput)
          .catch((e) => setOutput(e.toString()));
      } else {
        decryptRsa(keyFormat(), privateKey(), input())
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

        {/* 密钥长度 */}
        <Config.Option
          label="密钥长度"
          icon={() => <Ruler size={16} />}
          description="选择密钥的长度，单位为位，一个字节为8位。"
        >
          <Config.Select
            value={bitSize()}
            options={BIT_SIZE_OPTIONS}
            onChange={setBitSize}
            class="w-30"
          />
        </Config.Option>

        {/*密钥格式*/}
        <Config.Option
          label="密钥格式"
          icon={() => <PanelLeftRightDashed size={16} />}
          description="选择私钥和公钥的编码格式"
        >
          <Config.Select
            value={keyFormat()}
            options={KEY_FORMAT_OPTIONS}
            onChange={(value) => setKeyFormat(value as KeyFormat)}
            class="w-30"
          />
        </Config.Option>
      </Config.Card>

      {/* 密钥对 */}
      <div class="flex h-0 max-h-100 flex-1 gap-4">
        {/*私钥*/}
        <Card class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title value="私钥" />
            <TextWriteButtons callback={setPrivateKey} position="before">
              <GenerateButton
                label="生成密钥对"
                onGenerate={() =>
                  generateRsaKeyPair(keyFormat(), bitSize()).then(
                    ([privateKey, publicKey]) => {
                      setPublicKey(publicKey);
                      setPrivateKey(privateKey);
                    },
                  )
                }
              />
              <CopyButton value={privateKey()} />
            </TextWriteButtons>
          </div>
          <Editor
            value={privateKey()}
            onChange={setPrivateKey}
            placeholder="输入 RSA 私钥"
          />
        </Card>

        {/*公钥*/}
        <Card class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title value="公钥" />
            <TextWriteButtons callback={setPublicKey}>
              <CopyButton value={publicKey()} />
            </TextWriteButtons>
          </div>
          <Editor
            value={publicKey()}
            onChange={setPublicKey}
            placeholder="输入 RSA 公钥"
          />
        </Card>
      </div>

      <IOLayout
        items={[
          <>
            {" "}
            <div class="flex items-center justify-between">
              <Title value="输入" />
              <TextWriteButtons callback={setInput} />
            </div>
            <Editor
              value={input()}
              onChange={setInput}
              placeholder={
                encryption() ? "输入需要加密的数据" : "输入需要解密的数据"
              }
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="输出" />
              <TextReadButtons value={output()} />
            </div>
            <Editor value={output()} readOnly={true} />
          </>,
        ]}
      />
    </Container>
  );
}
