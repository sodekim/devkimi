import {
  decryptRsa,
  encryptRsa,
  generateRsaKeyPair,
} from "@/command/crypto/rsa";
import { KeyFormat, RsaBitSize, RsaKeyPair } from "@/command/crypto/type";
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
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { ArrowLeftRight, PanelLeftRightDashed, Ruler } from "lucide-solid";
import { createResource } from "solid-js";
import { RSA_BIT_SIZE_OPTIONS } from "./options";

export default function RsaCrypto() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    encryption: true,
    keyFormat: KeyFormat.Pkcs8,
    keyPair: {
      private: "",
      public: "",
      size: RsaBitSize.Bits2048,
    } as RsaKeyPair,
    input: "",
  });

  // 加密或解密
  const setEncryption = (value: boolean) => {
    setStore({
      encryption: value,
      keyFormat: KeyFormat.Pkcs8,
      keyPair: { private: "", public: "", size: RsaBitSize.Bits2048 },
      input: "",
    });
  };

  // 生成密钥对
  const generateKeyPair = () => {
    generateRsaKeyPair(store.keyFormat, store.keyPair.size).then(([k1, k2]) => {
      setStore("keyPair", (prev) => ({ ...prev, private: k1, public: k2 }));
    });
  };

  // 处理结果
  const [output] = createResource(
    () => ({
      encryption: store.encryption,
      keyFormat: store.keyFormat,
      keyPair: { ...store.keyPair },
      input: store.input,
    }),
    ({ encryption, keyFormat, keyPair, input }) => {
      if (input) {
        if (encryption && keyPair.public) {
          return encryptRsa(keyFormat, keyPair.public, input).catch(stringify);
        }
        if (!encryption && keyPair.private) {
          return decryptRsa(keyFormat, keyPair.private, input).catch(stringify);
        }
      }
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
            value={store.encryption}
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
            value={store.keyPair.size}
            options={RSA_BIT_SIZE_OPTIONS}
            onChange={(value) =>
              setStore("keyPair", { size: value, public: "", private: "" })
            }
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
            value={store.keyFormat}
            options={Object.keys(KeyFormat)}
            onChange={(value) => setStore("keyFormat", value)}
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
          operation={
            <TextWriteButtons
              callback={(value) =>
                setStore("keyPair", (prev) => ({ ...prev, private: value }))
              }
              position="before"
            >
              <GenerateButton label="生成密钥对" onGenerate={generateKeyPair} />
              <CopyButton value={store.keyPair.private} />
            </TextWriteButtons>
          }
        >
          <Editor
            value={store.keyPair.private}
            onChange={(value) =>
              setStore("keyPair", (prev) => ({ ...prev, private: value }))
            }
            placeholder="输入 RSA 私钥"
          />
        </Card>

        {/*公钥*/}
        <Card
          class="h-full w-0 flex-1"
          title="公钥"
          operation={
            <TextWriteButtons
              callback={(value) =>
                setStore("keyPair", (prev) => ({ ...prev, public: value }))
              }
            >
              <CopyButton value={store.keyPair.public} />
            </TextWriteButtons>
          }
        >
          <Editor
            value={store.keyPair.public}
            onChange={(value) =>
              setStore("keyPair", (prev) => ({ ...prev, public: value }))
            }
            placeholder="输入 RSA 公钥"
          />
        </Card>
      </Main>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={
            <TextWriteButtons callback={(value) => setStore("input", value)} />
          }
        >
          <Editor
            value={store.input}
            onChange={(value) => setStore("input", value)}
            placeholder={
              store.encryption ? "输入需要加密的数据" : "输入需要解密的数据"
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
