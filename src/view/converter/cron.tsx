import { ALargeSmall, RefreshCcw, Sigma } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { parseCron } from "@/command/converter/cron";
import {
  ClearButton,
  CopyButton,
  PasteButton,
  SaveButton,
  TextReadButtons,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";
import Title from "@/component/Title";

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
    <Container>
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
      <Card>
        <div class="flex items-center justify-between">
          <Title value="CRON表达式" />
          <div class="flex items-center justify-center gap-2">
            <PasteButton onRead={setCron} />
            <ClearButton onClick={() => setCron("")} />
          </div>
        </div>
        <input
          class="input input-md w-full rounded-md font-mono font-bold outline-none"
          value={cron()}
          onInput={(e) => setCron(e.target.value)}
        />
      </Card>

      {/*计划时间*/}
      <Card class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <Title value="计划执行时间" />
          <TextReadButtons value={output()} position="before">
            <button class="btn btn-sm" onClick={() => setN(n() + 1)}>
              <RefreshCcw size={16} />
              重新生成
            </button>
          </TextReadButtons>
        </div>
        <Editor value={output()} readOnly={true} />
      </Card>
    </Container>
  );
}
