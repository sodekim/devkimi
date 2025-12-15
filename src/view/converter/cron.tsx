import { parseCron } from "@/command/converter/cron";
import { ClearButton, PasteButton, TextReadButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Title from "@/component/Title";
import { ALargeSmall, RefreshCcw, Sigma } from "lucide-solid";
import { createResource, createSignal } from "solid-js";

export default function CronConverter() {
  const [cron, setCron] = createSignal("* * * * * *");
  const [size, setSize] = createSignal(10);
  const [pattern, setPattern] = createSignal("%Y-%m-%d %H:%M:%S");

  const [output, { refetch }] = createResource(
    () => ({ cron: cron(), size: size(), pattern: pattern() }),
    ({ cron, size, pattern }) => {
      return parseCron(cron, size, pattern)
        .then((times) => times.join("\n"))
        .catch((e) => e.toString());
    },
  );

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
          <Title>CRON表达式</Title>
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
          <Title loading={output.loading}>计划执行时间</Title>
          <TextReadButtons value={output()} position="before">
            <button class="btn btn-sm" onClick={() => refetch()}>
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
