import { ALargeSmall, RefreshCcw, Sigma } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { parseCron } from "../../command/converter/cron";
import {
  ClearButton,
  CopyButton,
  PasteButton,
  SaveButton,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";

export default function CronConverter() {
  const [cron, setCron] = createSignal("* * * * * *");
  const [size, setSize] = createSignal(20);
  const [pattern, setPattern] = createSignal("%Y-%m-%d %H:%M:%S");
  const [output, setOutput] = createSignal("");
  const [n, setN] = createSignal(0);

  createEffect(() => {
    const _ = n();
    if (cron().length > 0) {
      parseCron(cron(), size(), pattern())
        .then((times) => setOutput(times.join("\n")))
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });
  return (
    <div class="flex h-full flex-col gap-4">
      {/* 配置 */}
      <Config.Card>
        <Config.Option
          label="输出格式"
          description="计划执行时间的格式"
          icon={() => <ALargeSmall size={16} />}
        >
          <Config.Input value={pattern()} onInput={setPattern} class="w-50" />
        </Config.Option>

        <Config.Option
          label="计划数量"
          description="需要生成多少个计划执行时间"
          icon={() => <Sigma size={16} />}
        >
          <Config.NumberInput
            value={size()}
            onInput={setSize}
            min={1}
            max={10000}
            placeholder="数量"
            class="w-20"
          />
        </Config.Option>
      </Config.Card>

      {/*CRON表达式*/}
      <Container class="h-30">
        <div class="flex items-center justify-between">
          <span class="text-sm">CRON表达式</span>
          <div class="flex items-center justify-center gap-2">
            <PasteButton onRead={setCron} />
            <ClearButton onClick={() => setCron("")} />
          </div>
        </div>
        <input
          class="input w-full rounded-md outline-none"
          value={cron()}
          onInput={(e) => setCron(e.target.value)}
        />
      </Container>

      {/*计划时间*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">计划执行时间</span>
          <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm" onClick={() => setN(n() + 1)}>
              <RefreshCcw size={16} />
              重新生成
            </button>
            <CopyButton value={output()} />
            <SaveButton value={output()} />
          </div>
        </div>
        <Editor value={output()} readOnly={true} />
      </Container>
    </div>
  );
}
