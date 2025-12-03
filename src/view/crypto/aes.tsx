import {
  ArrowLeftRight,
  Blend,
  PanelLeftRightDashed,
  Ruler,
} from "lucide-solid";
import { createEffect, createSignal, Show } from "solid-js";
import {
  BIT_SIZE_OPTIONS,
  BitSize,
  BLOCK_MODE_OPTIONS,
  BlockMode,
  createEncodingText,
  Encoding,
  Padding,
  PADDING_OPTIONS,
} from "../../command/crypto/type";
import {
  ClearButton,
  CopyButton,
  GenerateButton,
  PasteButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";
import { EncodingInput, EncodingSelect } from "../../component/Encoding";
import {
  decryptAes,
  encryptAes,
  generateAesIv,
  generateAesKey,
} from "../../command/crypto/aes";

export default function Aes() {
  const [encryption, setEncryption] = createSignal(true);
  const [blockMode, setBlockMode] = createSignal(BlockMode.Cbc);
  const [bitSize, setBitSize] = createSignal(BitSize.Bit128);
  const [key, setKey] = createEncodingText();
  const [iv, setIv] = createEncodingText();
  const [input, setInput] = createEncodingText({ encoding: Encoding.Utf8 });
  const [padding, setPadding] = createSignal(Padding.Pkcs7);
  const [encoding, setEncoding] = createSignal(Encoding.Hex);
  const [output, setOutput] = createSignal("");

  // 当 bitSize 或 key.encoding 变化时，重新生成密钥
  createEffect(() => {
    generateAesKey(bitSize(), key.encoding).then((value) =>
      setKey("text", value),
    );
  });

  // 当 bitSize、blockMode 或 iv.encoding 变化时，重新生成向量
  createEffect(() => {
    generateAesIv(bitSize(), blockMode(), iv.encoding).then((value) =>
      setIv("text", value),
    );
  });

  createEffect(() => {
    if (input.text.length > 0) {
      if (encryption()) {
        encryptAes(
          bitSize(),
          input,
          key,
          iv,
          blockMode(),
          padding(),
          encoding(),
        )
          .then(setOutput)
          .catch((e) => setOutput(e.toString()));
      } else {
        decryptAes(
          bitSize(),
          input,
          key,
          iv,
          blockMode(),
          padding(),
          encoding(),
        )
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
        {/* 转换类型 */}
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
          description="密钥和向量的长度"
        >
          <Config.Select
            value={bitSize()}
            onChange={(value) => setBitSize(value as BitSize)}
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
      <Container>
        <div class="flex items-center justify-between">
          <span class="text-sm">密钥</span>
          <div class="flex items-center justify-center gap-2">
            <GenerateButton
              onGenerate={() =>
                generateAesKey(bitSize(), key.encoding).then((value) =>
                  setKey("text", value),
                )
              }
            />
            <PasteButton onRead={(value) => setKey("text", value)} />
            <ClearButton onClick={() => setKey("text", "")} />
          </div>
        </div>
        <EncodingInput value={key} setStore={setKey} placeholder="请输入密钥" />
      </Container>

      {/* 向量 */}
      <Show when={blockMode() !== "Ecb"}>
        <Container>
          <div class="flex items-center justify-between">
            <span class="text-sm">向量</span>
            <div class="flex items-center justify-center gap-2">
              <GenerateButton
                onGenerate={() =>
                  generateAesIv(bitSize(), blockMode(), iv.encoding).then(
                    (value) => setIv("text", value),
                  )
                }
              />
              <PasteButton onRead={(value) => setIv("text", value)} />
              <ClearButton onClick={() => setIv("text", "")} />
            </div>
          </div>
          <EncodingInput value={iv} setStore={setIv} placeholder="请输入向量" />
        </Container>
      </Show>

      {/*输入*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">输入</span>
          <div class="flex items-center justify-center gap-2">
            <EncodingSelect
              value={input.encoding}
              onChange={(value) => setInput("encoding", value)}
            />
            <TextOperateButtons callback={(value) => setInput("text", value)} />
          </div>
        </div>
        <Editor
          value={input.text}
          onChange={(value) => setInput("text", value)}
          placeholder={encryption() ? "输入要加密的数据" : "输入要解密的数据"}
        />
      </Container>

      {/*输出*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="flex items-center justify-center gap-4 text-sm">
            输出
          </span>
          <div class="flex items-center justify-center gap-2">
            <EncodingSelect
              exclude={[Encoding.Utf8] as const}
              value={encoding()}
              onChange={(value) => setEncoding(value)}
            />
            <CopyButton value={output()} />
            <SaveButton value={output()} />
          </div>
        </div>
        <Editor value={output()} readOnly={true} />
      </Container>
    </div>
  );
}
