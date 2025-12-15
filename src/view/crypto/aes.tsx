import {
  decryptAes,
  encryptAes,
  generateAesIv,
  generateAesKey,
} from "@/command/crypto/aes";
import {
  AesBitSize,
  BIT_SIZE_OPTIONS,
  BLOCK_MODE_OPTIONS,
  BlockMode,
  Encoding,
  Padding,
  PADDING_OPTIONS,
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
import { stringify } from "@/lib/util";
import {
  ArrowLeftRight,
  Blend,
  PanelLeftRightDashed,
  Ruler,
} from "lucide-solid";
import { batch, createResource, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

export default function AesCrypto() {
  const [encryption, setEncryption] = createSignal(true);
  const [blockMode, setBlockMode] = createSignal(BlockMode.Cbc);
  const [bitSize, setBitSize] = createSignal(AesBitSize.Bit128);
  const [padding, setPadding] = createSignal(Padding.Pkcs7);
  const [input, setInput] = createSignal("");
  const [encodings, setEncodings] = createStore<{
    key: Encoding;
    iv: Encoding;
    input: Encoding;
    output: Encoding;
  }>({
    key: Encoding.Utf8,
    iv: Encoding.Utf8,
    input: Encoding.Utf8,
    output: Encoding.Hex,
  });

  // 切换加密/解密
  const switchEncryption = (value: boolean) => {
    batch(() => {
      setInput("");
      setBlockMode(BlockMode.Cbc);
      setBitSize(AesBitSize.Bit128);
      setPadding(Padding.Pkcs7);
      setEncodings({
        key: Encoding.Utf8,
        iv: Encoding.Utf8,
        input: value ? Encoding.Utf8 : Encoding.Hex,
        output: value ? Encoding.Hex : Encoding.Utf8,
      });
      setEncryption(value);
    });
  };

  // 加密key
  const [key, { mutate: setKey, refetch: refetchKey }] = createResource(
    () => generateAesKey(bitSize(), encodings.key).catch(stringify),
    { initialValue: "" },
  );

  // 加密iv
  const [iv, { mutate: setIv, refetch: refetchIv }] = createResource(
    () => generateAesIv(bitSize(), blockMode(), encodings.iv).catch(stringify),
    { initialValue: "" },
  );

  // 输出
  const [output] = createResource(
    () => ({
      bitSize: bitSize(),
      input: { text: input(), encoding: encodings.input },
      key: { text: key(), encoding: encodings.key },
      iv: { text: iv(), encoding: encodings.iv },
      blockMode: blockMode(),
      padding: padding(),
      encoding: encodings.output,
    }),
    ({ bitSize, input, key, iv, blockMode, padding, encoding }) => {
      if (input.text && key.text && (iv.text || blockMode === BlockMode.Ecb)) {
        return (
          encryption()
            ? encryptAes(bitSize, input, key, iv, blockMode, padding, encoding)
            : decryptAes(bitSize, input, key, iv, blockMode, padding, encoding)
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
            value={encryption()}
            onChange={switchEncryption}
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
            onChange={(value) => setBitSize(value as AesBitSize)}
            options={BIT_SIZE_OPTIONS}
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
            value={blockMode()}
            options={BLOCK_MODE_OPTIONS}
            onChange={(value) => setBlockMode(value as BlockMode)}
            class="w-60"
          />
        </Config.Option>

        {/* 填充模式 */}
        <Show when={blockMode() !== "Ctr" && blockMode() !== "Ofb"}>
          <Config.Option
            label="填充模式"
            icon={() => <PanelLeftRightDashed size={16} />}
            description="数据填充模式"
          >
            <Config.Select
              value={padding()}
              options={PADDING_OPTIONS}
              onChange={(value) => setPadding(value as Padding)}
              class="w-40"
            />
          </Config.Option>
        </Show>
      </Config.Card>

      {/* 密钥 */}
      <Card
        title="密钥"
        loading={key.loading}
        operation={
          <Flex>
            <GenerateButton onGenerate={refetchKey} />
            <PasteButton onRead={setKey} />
            <ClearButton onClick={() => setKey("")} />
          </Flex>
        }
      >
        <EncodingTextInput
          value={{ text: key(), encoding: encodings.key }}
          onTextChange={setKey}
          onEncodingChange={(value) => setEncodings("key", value)}
          placeholder="输入密钥"
        />
      </Card>

      {/* 向量 */}
      <Show when={blockMode() !== BlockMode.Ecb}>
        <Card
          title="向量"
          loading={iv.loading}
          operation={
            <Flex>
              <GenerateButton label="生成向量" onGenerate={refetchIv} />
              <PasteButton onRead={setIv} />
              <ClearButton onClick={() => setIv("")} />
            </Flex>
          }
        >
          <EncodingTextInput
            value={{ text: iv(), encoding: encodings.iv }}
            onTextChange={setIv}
            onEncodingChange={(value) => setEncodings("iv", value)}
            placeholder="输入向量"
          />
        </Card>
      </Show>

      <Main>
        <Card
          class="h-full w-0 flex-1"
          title="输入"
          operation={
            <TextWriteButtons callback={setInput} position="before">
              <EncodingSelect
                label="编码"
                value={encodings.input}
                onChange={(value) => setEncodings("input", value)}
                exclude={encryption() ? [] : [Encoding.Utf8]}
              />
            </TextWriteButtons>
          }
        >
          <Editor
            value={input()}
            onChange={setInput}
            placeholder={encryption() ? "输入要加密的数据" : "输入要解密的数据"}
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
                exclude={encryption() ? [Encoding.Utf8] : []}
                value={encodings.output}
                onChange={(value) => setEncodings("output", value)}
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
