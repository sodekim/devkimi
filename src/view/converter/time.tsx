import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Title from "@/component/Title";
import dayjs from "dayjs";
import { CircleCheckBig, LandPlot, RefreshCcw } from "lucide-solid";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  Show,
  untrack,
} from "solid-js";
import utc from "dayjs/plugin/utc";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { twMerge } from "tailwind-merge";

dayjs.extend(utc);

function getGroupedTimeZones(): Record<string, string[]> {
  const timeZones = Intl.supportedValuesOf("timeZone");
  const grouped: Record<string, string[]> = {};
  timeZones.forEach((timeZone) => {
    const region = timeZone.split("/")[0];
    if (!grouped[region]) {
      grouped[region] = [];
    }
    grouped[region].push(timeZone);
  });
  return grouped;
}

function getWeekday(day: number): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return weekdays[day];
}

export default function TimeConverter() {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZones = getGroupedTimeZones();
  const [timeZone, setTimeZone] = createSignal(localTimeZone);
  const [now, setNow] = createSignal(dayjs());
  const date = createMemo(() => now().format("YYYY年MM月DD日"));
  const time = createMemo(() => now().format("HH:mm:ss"));
  const week = createMemo(() => `星期${getWeekday(now().day())}`);
  const seconds = createMemo(() => now().unix());
  const milliseconds = createMemo(() => now().valueOf());
  let timer = -1;

  onMount(() => {
    timer = setInterval(() => setNow(dayjs()), 1000);
  });

  onCleanup(() => {
    if (timer != -1) {
      clearInterval(timer);
    }
  });

  const timeZoneOptions = Object.entries(timeZones).map(([region, values]) =>
    [
      <option value={region} class="text-lg font-bold" disabled>
        {region}
      </option>,
    ].concat(
      values.map((value) => (
        <option value={value} selected={value === timeZone()} class="px-8">
          {value}
        </option>
      )),
    ),
  );

  return (
    <Container>
      <Card>
        <Title value="当前时间" />
        <div class="border-base-content/20 flex items-center justify-center gap-2 rounded-md border p-4">
          <div class="flex flex-1 flex-col items-center justify-center gap-4">
            <span class="font-mono text-4xl font-bold">{time()}</span>
            <span class="text-lg font-bold">
              {date()} {week()}
            </span>
            <label class="select select-sm outline-none">
              <span class="label">时区</span>
              <select
               
                onChange={(e) => setTimeZone(e.target.value)}
              >
                {timeZoneOptions}
              </select>
            </label>
          </div>
          <div class="flex flex-col items-start justify-center gap-2">
            <span class="text-md font-bold">UNIX 时间戳</span>
            <TimeButton value={seconds()} badge="秒" />
            <TimeButton value={milliseconds()} badge="毫秒" />
          </div>
        </div>
      </Card>

      <Card>
        <Title value="时间戳转时间" />
      </Card>

      <Card>
        <Title value="时间转时间戳" />
      </Card>
    </Container>
  );
}

const TimeButton = (props: {
  value: number | string;
  badge: string;
  class?: string;
}) => {
  const [handle, setHandle] = createSignal<number | null>(null);
  return (
    <div class={twMerge("flex items-center justify-start gap-2", props.class)}>
      <Show
        when={!handle()}
        fallback={
          <CircleCheckBig size={16} color="var(--color-success)" class="w-15" />
        }
      >
        <div class="badge-sm badge-accent badge w-15">{props.badge}</div>
      </Show>
      <div class="tooltip" data-tip="点击复制">
        <button
          class="btn btn-ghost justify-start font-mono text-lg font-bold"
          onClick={() =>
            writeText(`${props.value}`).then(() => {
              const _handle = handle();
              if (_handle) {
                clearTimeout(_handle);
              }
              setHandle(setTimeout(() => setHandle(null), 3000));
            })
          }
        >
          {props.value}
        </button>
      </div>
    </div>
  );
};
