import Card from "@/component/Card";
import Container from "@/component/Container";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import dayjs from "dayjs";
import timeZone from "dayjs/plugin/timeZone";
import utc from "dayjs/plugin/utc";
import zh from "dayjs/locale/zh-cn";
import relativeTime from 'dayjs/plugin/relativeTime'
import { CircleCheckBig } from "lucide-solid";
import {
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  Show
} from "solid-js";
import { createStore } from "solid-js/store";
import { twMerge } from "tailwind-merge";
import { ClearButton, PasteButton } from "@/component/Buttons";

dayjs.extend(utc);
dayjs.extend(timeZone);
dayjs.extend(relativeTime);

function getWeekDay(day: number): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return weekdays[day];
}

const TIME_ZONE_OPTIONS = {
  "亚洲": [
    { label: "上海 (UTC +8)", value: "Asia/Shanghai" },
    { label: "北京 (UTC +8)", value: "Asia/Beijing" },
    { label: "香港 (UTC +8)", value: "Asia/Hong_Kong" },
    { label: "台北 (UTC +8)", value: "Asia/Taipei" },
    { label: "东京 (UTC +9)", value: "Asia/Tokyo" },
    { label: "首尔 (UTC +9)", value: "Asia/Seoul" },
    { label: "新加坡 (UTC +8)", value: "Asia/Singapore" },
    { label: "曼谷 (UTC +7)", value: "Asia/Bangkok" },
    { label: "孟买/德里 (UTC +5:30)", value: "Asia/Mumbai" },
    { label: "迪拜 (UTC +4)", value: "Asia/Dubai" }
  ],
  "欧洲": [
    { label: "伦敦 (UTC +0)", value: "Europe/London" },
    { label: "巴黎 (UTC +2)", value: "Europe/Paris" },
    { label: "柏林 (UTC +2)", value: "Europe/Berlin" },
    { label: "罗马 (UTC +2)", value: "Europe/Rome" },
    { label: "马德里 (UTC +2)", value: "Europe/Madrid" },
    { label: "阿姆斯特丹 (UTC +1)", value: "Europe/Amsterdam" },
    { label: "莫斯科 (UTC +3)", value: "Europe/Moscow" },
    { label: "斯德哥尔摩 (UTC +1)", value: "Europe/Paris" },
  ],
  "美洲": [
    { label: "纽约 (UTC -5)", value: "America/New_York" },
    { label: "洛杉矶 (UTC -8)", value: "America/Los_Angeles" },
    { label: "芝加哥 (UTC -6)", value: "America/Chicago" },
    { label: "多伦多 (UTC -5)", value: "America/Toronto" },
    { label: "温哥华 (UTC -8)", value: "America/Vancouver" },
    { label: "蒙特利尔 (UTC -5)", value: "America/Montreal" },
    { label: "墨西哥城 (UTC -6)", value: "America/Mexico_City" },
    { label: "布宜诺斯艾利斯 (UTC -3)", value: "America/Buenos_Aires" },
    { label: "圣保罗 (UTC -3)", value: "America/Sao_Paulo" }
  ],
  "大洋洲": [
    { label: "悉尼 (UTC +10)", value: "Australia/Sydney" },
    { label: "墨尔本 (UTC +10)", value: "Australia/Melbourne" },
    { label: "布里斯班 (UTC +10)", value: "Australia/Brisbane" },
    { label: "珀斯 (UTC +8)", value: "Australia/Perth" },
    { label: "奥克兰 (UTC +12)", value: "Pacific/Auckland" },
  ],
  "非洲": [
    { label: "开罗 (UTC +2)", value: "Africa/Cairo" },
    { label: "拉各斯 (UTC +1)", value: "Africa/Lagos" },
    { label: "约翰内斯堡 (UTC +2)", value: "Africa/Johannesburg" },
  ]
};

export default function TimeConverter() {
  const atTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcOffset = dayjs().utcOffset() / 60;
  const [timeZone, setTimeZone] = createSignal(atTimeZone);
  const [now, setNow] = createSignal(dayjs().tz(timeZone()));
  const date = createMemo(() => now().format("YYYY年MM月DD日"));
  const time = createMemo(() => now().format("HH:mm:ss"));
  const week = createMemo(() => `星期${getWeekDay(now().day())}`);
  const seconds = createMemo(() => now().unix());
  const milliseconds = createMemo(() => now().valueOf());

  const [timestamp, setTimestamp] = createSignal(0);
  const [result1, setResult1] = createStore<{ local: string; utc: string; iso8601: string; relative: string }>({
    local: "-",
    relative: "-",
    iso8601: "-",
    utc: "-"
  });
  createRenderEffect(() => {
    const time = dayjs(timestamp());
    setResult1({
      local: time.format("YYYY-MM-DD HH:mm:ss"),
      utc: time.utc().format("YYYY-MM-DD HH:mm:ss"),
      iso8601: time.toISOString(),
      relative: time.locale(zh).toNow()
    });
  });

  const [datetime, setDatetime] = createSignal(dayjs().format("YYYY/MM/DD HH:mm"));
  const [result2, setResult2] = createStore<{
    seconds: number,
    milliseconds: number,
  }>({ seconds: 0, milliseconds: 0 });
  createEffect(() => {
    const time = dayjs(datetime());
    setResult2({
      seconds: time.unix(),
      milliseconds: time.valueOf()
    })
  });

  // 定时器
  let timer = -1;
  createEffect(() => {
    if (timer != -1) {
      clearInterval(timer);
    }
    timer = setInterval(() => setNow(dayjs().tz(timeZone())), 1000);
  });
  onCleanup(() => {
    if (timer != -1) {
      clearInterval(timer);
    }
  });

  const timeZoneOptions = Object.entries(TIME_ZONE_OPTIONS).map(([region, values]) =>
    [
      <option value={region} class="text-md font-bold" disabled>
        {region}
      </option>,
    ].concat(
      values.map(({ label, value }) => (
        <option value={value} selected={value === timeZone()} class="px-4">
          {label}
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
                onChange={(e) => {
                  setTimeZone(e.target.value);
                  setNow(dayjs().tz(e.target.value));
                }}
              >
                <option value={atTimeZone}>本地时区 (UTC +{utcOffset})</option>
                <option value="UTC" >UTC +0</option>
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

      <IOLayout items={[
        <>
          <div class="flex items-center justify-between">
            <Title value="时间戳转时间" />
            <div class="flex justify-center items-center gap-2">
              <PasteButton onRead={(value) => setTimestamp(Number(value))} />
              <ClearButton onClick={() => setTimestamp(0)} />
            </div>
          </div>
          <input class="input outline-none w-full" placeholder="输入时间戳，支持毫秒、秒。" value={`${timestamp()}`} onInput={(e) => setTimestamp(Number(e.target.value))} />
          <fieldset class="fieldset bg-base-200 rounded-box p-4 w-full">
            <legend class="fieldset-legend">转换结果</legend>
            <label class="label">本地时间</label>
            <ClickCopyButton class="w-full" value={result1.local} />

            <label class="label">UTC 时间</label>
            <ClickCopyButton class="w-full" value={result1.utc} />

            <label class="label">ISO 8601</label>
            <ClickCopyButton class="w-full" value={result1.iso8601} />

            <label class="label">相对时间</label>
            <ClickCopyButton class="w-full" value={result1.relative} mono={false} />
          </fieldset>
        </>,
        <>
          <div class="flex items-center justify-between">
            <Title value="时间转时间戳" />
            <div class="flex justify-center items-center gap-2">
              <PasteButton onRead={(value) => setTimestamp(Number(value))} />
              <ClearButton onClick={() => setTimestamp(0)} />
            </div>
          </div>
          <input class="input outline-none w-full" placeholder="选择时间" type="datetime-local" value={datetime()} onInput={(e) => console.log(e.target.value)} />
          <fieldset class="fieldset bg-base-200 rounded-box p-4 w-full">
            <legend class="fieldset-legend">转换结果</legend>
            <label class="label">UNIX 时间戳 (秒)</label>
            <ClickCopyButton class="w-full" value={`${result2.seconds}`} />

            <label class="label">UNIX 时间戳 (毫秒)</label>
            <ClickCopyButton class="w-full" value={`${result2.milliseconds}`} />

          </fieldset>
        </>
      ]} />

    </Container>
  );
}

const ClickCopyButton = (props: { value: string; class?: string; mono?: boolean }) => {
  const [handle, setHandle] = createSignal<number | null>(null);
  return (<div class="tooltip" data-tip="点击复制">
    <button
      class={twMerge("btn justify-start text-lg font-bold border border-base-content/20", props.class, props.mono ?? true ? "font-mono" : "")}
      onClick={() =>
        writeText(props.value).then(() => {
          const _handle = handle();
          if (_handle) {
            clearTimeout(_handle);
          }
          setHandle(setTimeout(() => setHandle(null), 3000));
        })
      }
    >
      {props.value}
      <Show when={handle() !== null}>
        <CircleCheckBig size={16} color="var(--color-success)" />
      </Show>
    </button>
  </div>);
};

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
