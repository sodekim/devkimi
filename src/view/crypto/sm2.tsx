import { ArrowLeftRight, PanelLeftRightDashed } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import {
  decryptSm2,
  encryptSm2,
  generateSm2KeyPair,
  Sm2KeyFormat,
} from "../../command/crypto/sm2";
import {
  CopyButton,
  GenerateButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";

const KEY_FORMAT_OPTIONS = [
  { value: "Sec1", label: "PEM (SEC1)" },
  { value: "Pkcs8", label: "PEM (PKCS#8)" },
  { value: "Hex", label: "Hex" },
];

export default function Sm2() {
  const [encryption, setEncryption] = createSignal(true);
  const [keyFormat, setKeyFormat] = createSignal<Sm2KeyFormat>("Sec1");
  const [privateKey, setPrivateKey] = createSignal("");
  const [publicKey, setPublicKey] = createSignal("");
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");

  // 当 keyFormat 变化时，重新生成密钥对
  createEffect(() => {
    generateSm2KeyPair(keyFormat()).then(([private_key, public_key]) => {
      setPrivateKey(private_key);
      setPublicKey(public_key);
    });
  });

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
    <div class="flex h-full flex-col gap-4">
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
          description="选择私钥的编码格式"
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
      <div class="flex h-0 max-h-100 flex-1 gap-4">
        {/*私钥*/}
        <Container class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <span class="text-sm">私钥</span>
            <div class="flex items-center justify-center gap-2">
              <GenerateButton
                onGenerate={() =>
                  generateSm2KeyPair(keyFormat()).then(
                    ([private_key, public_key]) => {
                      setPrivateKey(private_key);
                      setPublicKey(public_key);
                    },
                  )
                }
              />
              <TextOperateButtons callback={setPrivateKey} />
              <CopyButton value={privateKey()} />
            </div>
          </div>
          <Editor
            value={privateKey()}
            onChange={setPrivateKey}
            placeholder="SM2 私钥"
          />
        </Container>

        {/*公钥*/}
        <Container class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <span class="text-sm">公钥</span>
            <div class="flex items-center justify-center gap-2">
              <TextOperateButtons callback={setPublicKey} />
              <CopyButton value={publicKey()} />
            </div>
          </div>
          <Editor
            value={publicKey()}
            onChange={setPublicKey}
            placeholder="SM2 公钥"
          />
        </Container>
      </div>

      {/* 输入 */}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输入</span>
          <div class="flex items-center justify-center gap-2">
            <TextOperateButtons callback={setInput} />
          </div>
        </div>
        <Editor
          value={input()}
          onChange={setInput}
          placeholder={
            encryption() ? "输入需要加密的数据" : "输入需要解密的数据"
          }
        />
      </Container>

      {/* 输出 */}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输出</span>
          <div class="flex items-center justify-center gap-2">
            <CopyButton value={output()} />
            <SaveButton value={output()} />
          </div>
        </div>
        <Editor value={output()} readOnly={true} />
      </Container>
    </div>
  );
}
