import { range } from "lodash";
import { ArrowLeftRight, AudioWaveform, Blend } from "lucide-solid";
import { createEffect, createSignal, Show } from "solid-js";
import { decodeGZip, encodeGZip } from "../../command/codec/gzip";
import {
  CopyButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";
import IOLayout from "../../component/IOLayout";

const getLevelText = (level: number) => {
  return level === 1 ? "1 (最快)" : level === 9 ? "9 (最好)" : `${level}`;
};

const COMPRESS_LEVEL_OPTIONS = range(1, 10).map((level) => ({
  label: getLevelText(level),
  value: level.toString(),
}));

export default function GZipCodec() {
  const [ratio, setRatio] = createSignal(0);
  const [level, setLevel] = createSignal(1);
  const [encode, setEncode] = createSignal(true);
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");

  // 切换模式时重置输入和输出
  createEffect(() => {
    const _ = encode();
    setInput("");
    setOutput("");
  });

  createEffect(() => {
    if (input().length > 0) {
      let promise = encode()
        ? encodeGZip(input(), level())
        : decodeGZip(input(), level());
      promise
        .then(({ value, ratio }) => {
          setOutput(value);
          setRatio(ratio);
        })
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
      setRatio(0);
    }
  });
  return (
    <div class="flex h-full flex-1 flex-col gap-4">
      {/* 配置 */}
      <Config.Card>
        {/* 操作配置 */}
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={encode()}
            onChange={setEncode}
            on="压缩"
            off="解压"
          />
        </Config.Option>

        {/* 压缩级别配置 */}
        <Show when={encode()}>
          <Config.Option
            label="压缩级别"
            description="级别越高压缩效果越好,压缩时间也会增加."
            icon={() => <Blend size={16} />}
          >
            <Config.Select
              value={`${level()}`}
              options={COMPRESS_LEVEL_OPTIONS}
              onChange={(value) => setLevel(parseInt(value))}
              class="w-30"
            />
          </Config.Option>
        </Show>
      </Config.Card>

      <IOLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <span class="text-sm">输入</span>
              <div class="flex items-center justify-center gap-2">
                <TextOperateButtons callback={setInput} />
              </div>
            </div>
            <Editor
              value={input()}
              onChange={(value) => setInput(value)}
              placeholder={encode() ? "输入要压缩的文本" : "输入要解压的文本"}
            />
          </>,
          <>
            <div class="flex items-center justify-between">
              <span class="flex items-center justify-center gap-4 text-sm">
                输出
              </span>
              <div class="flex items-center justify-center gap-2">
                <CopyButton value={output()} />
                <SaveButton value={output()} />
              </div>
            </div>
            <Editor value={output()} readOnly={true} />
          </>,
        ]}
      />

      <Container class="h-10 justify-center">
        <span class="flex items-center justify-start gap-1 text-sm">
          <AudioWaveform size={16} />
          压缩率
          <span class={ratio() > 0 ? "text-success" : "text-warning"}>
            {(ratio() * 100).toFixed(2)}%
          </span>
        </span>
      </Container>
    </div>
  );
}
