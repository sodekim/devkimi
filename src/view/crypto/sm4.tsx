import {
  decryptSm4,
  encryptSm4,
  generateSm4Iv,
  generateSm4Key,
} from "@/command/crypto/sm4";
import {
  BLOCK_MODE_OPTIONS,
  BlockMode,
  createEncodingText,
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
import MainLayout from "@/component/IOLayout";
import Main from "@/component/Main";
import Title from "@/component/Title";
import { ArrowLeftRight, Blend, PanelLeftRightDashed } from "lucide-solid";
import { batch, createEffect, createMemo, createSignal, Show } from "solid-js";

export default function Sm4() {
  const [encryption, _setEncryption] = createSignal(true);
  const [blockMode, setBlockMode] = createSignal(BlockMode.Cbc);
  const [key, setKey] = createEncodingText();
  const [iv, setIv] = createEncodingText();
  const [padding, setPadding] = createSignal(Padding.Pkcs7);
  const [input, setInput] = createEncodingText({ encoding: Encoding.Utf8 });
  const [output, setOutput] = createSignal("");
  const [encoding, setEncoding] = createSignal(Encoding.Hex);
  const inputEncodingExcludes = createMemo(() =>
    encryption() ? [] : [Encoding.Utf8],
  );
  const outputEncodingExcludes = createMemo(() =>
    encryption() ? [Encoding.Utf8] : [],
  );
  const setEncryption = (value: boolean) => {
    batch(() => {
      if (value) {
        setInput("encoding", Encoding.Utf8);
        setEncoding(Encoding.Hex);
      } else {
        setInput("encoding", Encoding.Hex);
        setEncoding(Encoding.Utf8);
      }
      setInput("text", "");
      setOutput("");
      _setEncryption(value);
    });
  };

  createEffect(() => {
    if (input.text.length > 0) {
      if (encryption()) {
        encryptSm4(input, key, iv, blockMode(), padding(), encoding())
          .then(setOutput)
          .catch((e) => setOutput(e.toString()));
      } else {
        decryptSm4(input, key, iv, blockMode(), padding(), encoding())
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
      <Card>
        <div class="flex items-center justify-between">
          <Title>密钥</Title>
          <div class="flex items-center justify-center gap-2">
            <GenerateButton
              onGenerate={() =>
                generateSm4Key(key.encoding).then((value) =>
                  setKey("text", value),
                )
              }
            />
            <PasteButton onRead={(value) => setKey("text", value)} />
            <ClearButton onClick={() => setKey("text", "")} />
          </div>
        </div>
        <EncodingTextInput
          value={key}
          setValue={setKey}
          placeholder="输入密钥"
        />
      </Card>

      {/* 向量 */}
      <Show when={blockMode() !== "Ecb"}>
        <Card>
          <div class="flex items-center justify-between">
            <Title>向量</Title>
            <div class="flex items-center justify-center gap-2">
              <GenerateButton
                label="生成向量"
                onGenerate={() =>
                  generateSm4Iv(blockMode(), iv.encoding).then((value) =>
                    setIv("text", value),
                  )
                }
              />
              <PasteButton onRead={(value) => setIv("text", value)} />
              <ClearButton onClick={() => setIv("text", "")} />
            </div>
          </div>
          <EncodingTextInput
            value={iv}
            setValue={setIv}
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
              callback={(value) => setInput("text", value)}
              position="before"
            >
              <EncodingSelect
                label="编码"
                value={input.encoding}
                onChange={(value) => setInput("encoding", value)}
                exclude={inputEncodingExcludes()}
              />
            </TextWriteButtons>
          }
        >
          <Editor
            value={input.text}
            onChange={(value) => setInput("text", value)}
            placeholder={encryption() ? "输入要加密的数据" : "输入要解密的数据"}
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          operation={
            <TextReadButtons value={output()} position="before">
              <EncodingSelect
                label="编码"
                exclude={outputEncodingExcludes()}
                value={encoding()}
                onChange={(value) => setEncoding(value)}
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
