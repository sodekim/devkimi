import { decodeGZip, encodeGZip } from "@/command/codec/gzip";
import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { ArrowLeftRight, AudioWaveform, Blend } from "lucide-solid";
import { createResource, Show } from "solid-js";

const getLevelText = (level: number) => {
  return level === 1 ? "1 (最快)" : level === 9 ? "9 (最好)" : `${level}`;
};

const COMPRESS_LEVEL_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 1).map(
  (level) => ({
    label: getLevelText(level),
    value: level,
  }),
);

export default function GZipCodec() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    input: "",
    level: 1,
    encode: true,
  });

  // 切换操作模式
  const setEncode = (value: boolean) => {
    setStore((prev) => ({ ...prev, input: "", encode: value }));
  };

  // 获取输出
  const [output] = createResource(
    () => ({ ...store }),
    ({ encode, level, input }) => {
      if (input) {
        return (
          encode ? encodeGZip(input, level) : decodeGZip(input, level)
        ).catch((e) => ({ value: e.toString(), ratio: 0 }));
      }
    },
    { initialValue: { value: "", ratio: 0 } },
  );

  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/* 操作配置 */}
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={store.encode}
            onChange={setEncode}
            on="压缩"
            off="解压"
          />
        </Config.Option>

        {/* 压缩级别配置 */}
        <Show when={store.encode}>
          <Config.Option
            label="压缩级别"
            description="级别越高压缩效果越好,压缩时间也会增加."
            icon={() => <Blend size={16} />}
          >
            <Config.Select
              value={store.level}
              options={COMPRESS_LEVEL_OPTIONS}
              onChange={(value) => setStore("level", value)}
              class="w-30"
            />
          </Config.Option>
        </Show>
      </Config.Card>

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
            placeholder={store.encode ? "输入要压缩的文本" : "输入要解压的文本"}
          />
        </Card>
        <Card
          class="h-full w-0 flex-1"
          title="输出"
          loading={output.loading}
          operation={<TextReadButtons value={output()?.value} />}
        >
          <Editor value={output()?.value} readOnly={true} />
        </Card>
      </Main>

      <Card>
        <span class="flex w-full items-center justify-start gap-1 text-sm">
          <AudioWaveform size={16} />
          压缩率
          <span
            class={(output()?.ratio ?? 0) > 0 ? "text-success" : "text-warning"}
          >
            {((output()?.ratio ?? 0) * 100).toFixed(2)}%
          </span>
        </span>
      </Card>
    </Container>
  );
}
