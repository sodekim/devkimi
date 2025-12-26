import {
  decryptDes,
  encryptDes,
  generateDesIv,
  generateDesKey,
} from "@/command/crypto/des";
import {
  BlockMode,
  DesBitSize,
  Encoding,
  EncodingText,
  Padding,
} from "@/command/crypto/type";
import {
  ClearButton,
  GenerateButton,
  PasteButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import { EncodingSelect, EncodingTextInput } from "@/component/Encoding";
import Flex from "@/component/Flex";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import {
  ArrowLeftRight,
  Blend,
  PanelLeftRightDashed,
  Ruler,
} from "lucide-solid";
import { createResource, Show } from "solid-js";
import {
  BLOCK_MODE_OPTIONS,
  DES_BIT_SIZE_OPTIONS,
  PADDING_OPTIONS,
} from "./options";

export default function DesCrypto() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    encryption: true,
    blockMode: BlockMode.Cbc,
    bitSize: DesBitSize.Bits64,
    padding: Padding.Pkcs7,
    input: { text: "", encoding: Encoding.Utf8 } as EncodingText,
    key: { text: "", encoding: Encoding.Utf8 } as EncodingText,
    iv: { text: "", encoding: Encoding.Utf8 } as EncodingText,
    encoding: Encoding.Hex,
  });

  // 切换模式
  const setEncryption = (value: boolean) => {
    setStore({
      encryption: value,
      blockMode: BlockMode.Cbc,
      bitSize: DesBitSize.Bits64,
      padding: Padding.Pkcs7,
      input: { text: "", encoding: value ? Encoding.Utf8 : Encoding.Hex },
      key: { text: "", encoding: Encoding.Utf8 },
      iv: { text: "", encoding: Encoding.Utf8 },
      encoding: value ? Encoding.Hex : Encoding.Utf8,
    });
  };

  // 生成密钥
  const generateKey = () => {
    generateDesKey(store.bitSize, store.key.encoding)
      .catch(stringify)
      .then((value) => setStore("key", "text", value));
  };

  // 生成向量
  const generateIv = () => {
    generateDesIv(store.bitSize, store.blockMode, store.iv.encoding)
      .catch(stringify)
      .then((value) => setStore("iv", "text", value));
  };

  // 输出结果
  const [output] = createResource(
    () => ({
      encryption: store.encryption,
      bitSize: store.bitSize,
      input: { ...store.input },
      key: { ...store.key },
      iv: { ...store.iv },
      blockMode: store.blockMode,
      padding: store.padding,
      encoding: store.encoding,
    }),
    ({ encryption, bitSize, input, key, iv, blockMode, padding, encoding }) => {
      if (input.text && key.text && (iv.text || blockMode === BlockMode.Ecb)) {
        return (
          encryption
            ? encryptDes(bitSize, input, key, iv, blockMode, padding, encoding)
            : decryptDes(bitSize, input, key, iv, blockMode, padding, encoding)
        ).catch(stringify);
      }
    },
  );

  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/* 转换类型 */}
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
            value={store.bitSize}
            onChange={(value) => setStore("bitSize", value)}
            options={DES_BIT_SIZE_OPTIONS}
            class="w-30"
          />
        </Config.Option>

        {/* 加密模式 */}
        <Config.Option
          label="加密模式"
          icon={() => <Blend size={16} />}
          description="ECB模式不需要输入向量(iv)，CTR和OFB模式不需要填充模式。"
        >
          <Config.Select
            value={store.blockMode}
            options={BLOCK_MODE_OPTIONS}
            onChange={(value) => setStore("blockMode", value)}
            class="w-60"
          />
        </Config.Option>

        {/* 填充模式 */}
        <Show
          when={
            store.blockMode !== BlockMode.Ctr &&
            store.blockMode !== BlockMode.Ofb
          }
        >
          <Config.Option
            label="填充模式"
            icon={() => <PanelLeftRightDashed size={16} />}
            description="数据填充模式"
          >
            <Config.Select
              value={store.padding}
              options={PADDING_OPTIONS}
              onChange={(value) => setStore("padding", value)}
              class="w-40"
            />
          </Config.Option>
        </Show>
      </Config.Card>

      {/* 密钥 */}
      <Card
        title="密钥"
        operation={
          <Flex>
            <GenerateButton onGenerate={generateKey} />
            <PasteButton onRead={(value) => setStore("key", "text", value)} />
            <ClearButton onClick={() => setStore("key", "text", "")} />
          </Flex>
        }
      >
        <EncodingTextInput
          value={store.key}
          onTextChange={(value) => setStore("key", "text", value)}
          onEncodingChange={(value) => setStore("key", "encoding", value)}
          placeholder="输入密钥"
        />
      </Card>

      {/* 向量 */}
      <Show when={store.blockMode !== BlockMode.Ecb}>
        <Card
          title="向量"
          operation={
            <Flex>
              <GenerateButton label="生成向量" onGenerate={generateIv} />
              <PasteButton onRead={(value) => setStore("iv", "text", value)} />
              <ClearButton onClick={() => setStore("iv", "text", "")} />
            </Flex>
          }
        >
          <EncodingTextInput
            value={store.iv}
            onTextChange={(value) => setStore("iv", "text", value)}
            onEncodingChange={(value) => setStore("iv", "encoding", value)}
            placeholder="输入向量"
          />
        </Card>
      </Show>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={
            <TextWriteButtons
              callback={(value) => setStore("input", "text", value)}
              position="before"
            >
              <EncodingSelect
                label="编码"
                value={store.input.encoding}
                onChange={(value) => setStore("input", "encoding", value)}
                exclude={store.encryption ? [] : [Encoding.Utf8]}
              />
            </TextWriteButtons>
          }
        >
          <Editor
            value={store.input.text}
            onChange={(value) => setStore("input", "text", value)}
            placeholder={
              store.encryption ? "输入要加密的数据" : "输入要解密的数据"
            }
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={
            <TextReadButtons value={output()} position="before">
              <EncodingSelect
                label="编码"
                exclude={store.encryption ? [Encoding.Utf8] : []}
                value={store.encoding}
                onChange={(value) => setStore("encoding", value)}
              />
            </TextReadButtons>
          }
        >
          <Editor value={output()} readOnly={true} />
        </Card>
      </Main>
    </Container>
  );
}
