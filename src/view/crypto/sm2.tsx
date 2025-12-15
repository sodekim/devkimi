import {
  decryptSm2,
  encryptSm2,
  generateSm2KeyPair,
  Sm2KeyFormat,
} from "@/command/crypto/sm2";
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
import Main from "@/component/Main";
import { stringify } from "@/lib/util";
import { ArrowLeftRight, PanelLeftRightDashed } from "lucide-solid";
import { batch, createResource, createSignal } from "solid-js";

export default function Sm2Crypto() {
  const [encryption, setEncryption] = createSignal(true);
  const [keyFormat, setKeyFormat] = createSignal<Sm2KeyFormat>(
    Sm2KeyFormat.Pkcs8,
  );
  const [input, setInput] = createSignal("");
  const switchEncryption = (value: boolean) => {
    batch(() => {
      setInput("");
      setKeyFormat(Sm2KeyFormat.Pkcs8);
      setEncryption(value);
    });
  };

  // 生成密钥对
  const [keyPair, { refetch: refetchKeyPair, mutate: setKeyPair }] =
    createResource(
      () =>
        generateSm2KeyPair(keyFormat()).then(([privateKey, publicKey]) => ({
          privateKey,
          publicKey,
        })),
      {
        initialValue: { privateKey: "", publicKey: "" },
      },
    );

  // 输出
  const [output] = createResource(
    () => ({
      encryption: encryption(),
      keyFormat: keyFormat(),
      keyPair: keyPair(),
      input: input(),
    }),
    ({ encryption, keyFormat, keyPair, input }) => {
      if (input && keyPair.publicKey && keyPair.privateKey) {
        return (
          encryption
            ? encryptSm2(keyFormat, keyPair.publicKey, input)
            : decryptSm2(keyFormat, keyPair.privateKey, input)
        ).catch(stringify);
      }
    },
    { initialValue: "" },
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
            onChange={switchEncryption}
            on="加密"
            off="解密"
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
            options={Object.keys(Sm2KeyFormat)}
            onChange={(value) => setKeyFormat(value as Sm2KeyFormat)}
            class="w-30"
          />
        </Config.Option>
      </Config.Card>

      {/* 密钥对 */}
      <Main>
        {/*私钥*/}
        <Card
          class="h-full w-0 flex-1"
          title="私钥"
          loading={keyPair.loading}
          operation={
            <TextWriteButtons
              callback={(privateKey) =>
                setKeyPair((prev) => ({ ...prev, privateKey }))
              }
              position="before"
            >
              <GenerateButton label="生成密钥对" onGenerate={refetchKeyPair} />
              <CopyButton value={keyPair().privateKey} />
            </TextWriteButtons>
          }
        >
          <Editor
            value={keyPair().privateKey}
            onChange={(value) =>
              setKeyPair((prev) => ({ ...prev, privateKey: value }))
            }
            placeholder="输入 RSA 私钥"
          />
        </Card>

        {/*公钥*/}
        <Card
          class="h-full w-0 flex-1"
          title="公钥"
          loading={keyPair.loading}
          operation={
            <TextWriteButtons
              callback={(publicKey) =>
                setKeyPair((prev) => ({ ...prev, publicKey }))
              }
            >
              <CopyButton value={keyPair().publicKey} />
            </TextWriteButtons>
          }
        >
          <Editor
            value={keyPair().publicKey}
            onChange={(value) =>
              setKeyPair((prev) => ({ ...prev, publicKey: value }))
            }
            placeholder="输入 RSA 公钥"
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
          loading={output.loading}
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
