import {
  decryptRsa,
  encryptRsa,
  generateRsaKeyPair,
} from "@/command/crypto/rsa";
import { KeyFormat, RsaBitSize } from "@/command/crypto/type";
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
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { ArrowLeftRight, PanelLeftRightDashed, Ruler } from "lucide-solid";
import { batch, createResource, createSignal } from "solid-js";

export default function Rsa() {
  const [encryption, _setEncryption] = createSignal(true);
  const [keyFormat, setKeyFormat] = createSignal<KeyFormat>(KeyFormat.Pkcs8);
  const [bitSize, setBitSize] = createSignal<RsaBitSize>(RsaBitSize.Bit1024);
  const [input, setInput] = createSignal("");
  const setEncryption = (value: boolean) => {
    batch(() => {
      setInput("");
      _setEncryption(value);
    });
  };

  // 处理数据
  const [output] = createResource(
    () => ({
      encryption: encryption(),
      keyFormat: keyFormat(),
      keyPair: keyPair(),
      input: input(),
    }),
    ({ encryption, keyFormat, keyPair, input }) => {
      if (input) {
        return (
          encryption
            ? encryptRsa(keyFormat, keyPair.publicKey, input)
            : decryptRsa(keyFormat, keyPair.privateKey, input)
        ).catch((e) => e.toString());
      }
    },
    { initialValue: "" },
  );

  // 生成密钥对
  const [keyPair, { refetch: refetchKeyPair, mutate: setKeyPair }] =
    createResource(
      () =>
        generateRsaKeyPair(keyFormat(), bitSize()).then(
          ([privateKey, publicKey]) => ({ privateKey, publicKey }),
        ),
      {
        initialValue: { privateKey: "", publicKey: "" },
      },
    );
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
            options={Object.keys(RsaBitSize)}
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
            options={Object.keys(KeyFormat)}
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
            <Title>私钥</Title>
            <TextWriteButtons
              callback={(privateKey) =>
                setKeyPair((prev) => ({ ...prev, privateKey }))
              }
              position="before"
            >
              <GenerateButton label="生成密钥对" onGenerate={refetchKeyPair} />
              <CopyButton value={keyPair().privateKey} />
            </TextWriteButtons>
          </div>
          <Editor
            value={keyPair().privateKey}
            onChange={(value) =>
              setKeyPair((prev) => ({ ...prev, privateKey: value }))
            }
            placeholder="输入 RSA 私钥"
          />
        </Card>

        {/*公钥*/}
        <Card class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title>公钥</Title>
            <TextWriteButtons
              callback={(publicKey) =>
                setKeyPair((prev) => ({ ...prev, publicKey }))
              }
            >
              <CopyButton value={keyPair().publicKey} />
            </TextWriteButtons>
          </div>
          <Editor
            value={keyPair().publicKey}
            onChange={(value) =>
              setKeyPair((prev) => ({ ...prev, publicKey: value }))
            }
            placeholder="输入 RSA 公钥"
          />
        </Card>
      </div>

      <MainLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title>输入</Title>
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
              <Title>输出</Title>
              <TextReadButtons value={output()} />
            </div>
            <Editor value={output()} readOnly={true} />
          </>,
        ]}
      />
    </Container>
  );
}
