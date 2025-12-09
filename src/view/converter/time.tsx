import { ClearButton, PasteButton } from "@/component/Buttons";
import Card from "@/component/Card";
import Container from "@/component/Container";
import Flex from "@/component/Flex";
import IOLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeZh from "air-datepicker/locale/zh";
import dayjs from "dayjs";
import timeZone from "dayjs/plugin/timeZone";
import utc from "dayjs/plugin/utc";
import { CircleCheckBig } from "lucide-solid";
import {
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { twMerge } from "tailwind-merge";

dayjs.extend(utc);
dayjs.extend(timeZone);

function getWeekDay(day: number): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return weekdays[day];
}

const TIME_ZONE_GROUP = {
  亚洲: [
    { label: "上海 (UTC +8)", value: "Asia/Shanghai" },
    { label: "香港 (UTC +8)", value: "Asia/Hong_Kong" },
    { label: "台北 (UTC +8)", value: "Asia/Taipei" },
    { label: "东京 (UTC +9)", value: "Asia/Tokyo" },
    { label: "首尔 (UTC +9)", value: "Asia/Seoul" },
    { label: "新加坡 (UTC +8)", value: "Asia/Singapore" },
    { label: "曼谷 (UTC +7)", value: "Asia/Bangkok" },
    { label: "孟买/德里 (UTC +5:30)", value: "Asia/Mumbai" },
    { label: "迪拜 (UTC +4)", value: "Asia/Dubai" },
  ],
  欧洲: [
    { label: "伦敦 (UTC +0)", value: "Europe/London" },
    { label: "巴黎 (UTC +2)", value: "Europe/Paris" },
    { label: "柏林 (UTC +2)", value: "Europe/Berlin" },
    { label: "罗马 (UTC +2)", value: "Europe/Rome" },
    { label: "马德里 (UTC +2)", value: "Europe/Madrid" },
    { label: "阿姆斯特丹 (UTC +1)", value: "Europe/Amsterdam" },
    { label: "莫斯科 (UTC +3)", value: "Europe/Moscow" },
    { label: "斯德哥尔摩 (UTC +1)", value: "Europe/Paris" },
  ],
  美洲: [
    { label: "纽约 (UTC -5)", value: "America/New_York" },
    { label: "洛杉矶 (UTC -8)", value: "America/Los_Angeles" },
    { label: "芝加哥 (UTC -6)", value: "America/Chicago" },
    { label: "多伦多 (UTC -5)", value: "America/Toronto" },
    { label: "温哥华 (UTC -8)", value: "America/Vancouver" },
    { label: "蒙特利尔 (UTC -5)", value: "America/Montreal" },
    { label: "墨西哥城 (UTC -6)", value: "America/Mexico_City" },
    { label: "布宜诺斯艾利斯 (UTC -3)", value: "America/Buenos_Aires" },
    { label: "圣保罗 (UTC -3)", value: "America/Sao_Paulo" },
  ],
  大洋洲: [
    { label: "悉尼 (UTC +10)", value: "Australia/Sydney" },
    { label: "墨尔本 (UTC +10)", value: "Australia/Melbourne" },
    { label: "布里斯班 (UTC +10)", value: "Australia/Brisbane" },
    { label: "珀斯 (UTC +8)", value: "Australia/Perth" },
    { label: "奥克兰 (UTC +12)", value: "Pacific/Auckland" },
  ],
  非洲: [
    { label: "开罗 (UTC +2)", value: "Africa/Cairo" },
    { label: "拉各斯 (UTC +1)", value: "Africa/Lagos" },
    { label: "约翰内斯堡 (UTC +2)", value: "Africa/Johannesburg" },
  ],
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

  // 时间戳转时间
  const [timestamp, setTimestamp] = createSignal<number | undefined>(
    dayjs().valueOf(),
  );
  const [timestampUnit, setTimestampUnit] = createSignal<
    "milliseconds" | "seconds"
  >("milliseconds");
  const [parseTimestampResult, setParseTimestampResult] = createSignal<{
    local?: string;
    utc?: string;
    iso8601?: string;
  }>({});
  createRenderEffect(() => {
    const _timestamp = timestamp();
    if (_timestamp) {
      const time = dayjs(
        timestampUnit() === "milliseconds" ? _timestamp : _timestamp * 1000,
      );
      setParseTimestampResult({
        local: time.format("YYYY-MM-DD HH:mm:ss"),
        utc: time.utc().format("YYYY-MM-DD HH:mm:ss"),
        iso8601: time.toISOString(),
      });
    } else {
      setParseTimestampResult({});
    }
  });

  // 时间转时间戳
  const [dateTime, setDateTime] = createSignal(
    dayjs().format("YYYY/MM/DD HH:mm"),
  );
  const [parseDateTimeZone, setParseDateTimeZone] =
    createSignal<string>(atTimeZone);
  const [parseDateTimeResult, setParseDateTimeResult] = createSignal<{
    seconds?: number;
    milliseconds?: number;
    microseconds?: number;
  }>({});
  createEffect(() => {
    if (dateTime()) {
      const time = dayjs.tz(dateTime(), parseDateTimeZone());
      setParseDateTimeResult({
        seconds: time.unix(),
        milliseconds: time.valueOf(),
        microseconds: time.valueOf() * 1000,
      });
    } else {
      setParseDateTimeResult({});
    }
  });
  onMount(() => {
    new AirDatepicker("#datetime", {
      timepicker: true,
      timeFormat: "HH:mm",
      dateFormat: "yyyy/MM/dd",
      selectedDates: [new Date()],
      locale: localeZh,
      onSelect: (value) => {
        if (value.formattedDate) {
          setDateTime(value.formattedDate as string);
        } else {
          setDateTime("");
        }
      },
    });
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

  // 时区选项列表
  const timeZoneOptions = () =>
    Object.entries(TIME_ZONE_GROUP).flatMap(([region, values]) =>
      [
        <option value={region} class="text-md font-bold" disabled>
          {region}
        </option>,
      ].concat(
        values.map(({ label, value }) => (
          <option value={value} class="mx-4">
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
                value={timeZone()}
                onChange={(e) => {
                  setTimeZone(e.target.value);
                  setNow(dayjs().tz(e.target.value));
                }}
              >
                <option value={atTimeZone}>本地时区 (UTC +{utcOffset})</option>
                <option value="UTC">UTC +0</option>
                {timeZoneOptions()}
              </select>
            </label>
          </div>
          <div class="flex flex-col items-start justify-center gap-2">
            <span class="text-md font-bold">UNIX 时间戳</span>
            <Flex gap={2}>
              <div class="badge badge-accent w-15">秒</div>
              <ClickCopyButton value={`${seconds()}`} class="w-48" />
            </Flex>
            <Flex gap={2}>
              <div class="badge badge-accent w-15">毫秒</div>
              <ClickCopyButton value={`${milliseconds()}`} class="w-48" />
            </Flex>
          </div>
        </div>
      </Card>

      <IOLayout
        vertical={{ full: false }}
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title value="时间戳转时间" />
              <div class="flex items-center justify-center gap-2">
                <PasteButton onRead={(value) => setTimestamp(Number(value))} />
                <ClearButton onClick={() => setTimestamp(undefined)} />
              </div>
            </div>

            <Flex gap={2}>
              <label class="select flex-1 outline-none">
                <span class="label">单位</span>
                <select
                  onChange={(e) =>
                    setTimestampUnit(
                      e.target.value as "milliseconds" | "seconds",
                    )
                  }
                >
                  <option
                    value="milliseconds"
                    selected={timestampUnit() === "milliseconds"}
                  >
                    毫秒
                  </option>
                  <option
                    value="seconds"
                    selected={timestampUnit() === "seconds"}
                  >
                    秒
                  </option>
                </select>
              </label>
              <input
                type="number"
                class="input flex-1 [appearance:textfield] font-mono text-lg font-bold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="输入时间戳"
                value={`${timestamp() || ""}`}
                onInput={(e) => setTimestamp(e.target.valueAsNumber)}
              />
            </Flex>
            <fieldset class="fieldset bg-base-200 rounded-box w-full p-4">
              <legend class="fieldset-legend">转换结果</legend>
              <label class="label">本地时间</label>
              <ClickCopyButton
                class="w-full"
                value={parseTimestampResult().local || "-"}
              />

              <label class="label">UTC 时间</label>
              <ClickCopyButton
                class="w-full"
                value={parseTimestampResult().utc || "-"}
              />

              <label class="label">ISO 8601</label>
              <ClickCopyButton
                class="w-full"
                value={parseTimestampResult().iso8601 || "-"}
              />
            </fieldset>
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="时间转时间戳" />
              <div class="flex items-center justify-center gap-2">
                <ClearButton onClick={() => setDateTime("")} />
              </div>
            </div>

            <Flex gap={2}>
              <label class="select flex-1 outline-none">
                <span class="label">时区</span>
                <select
                  value={parseDateTimeZone()}
                  onChange={(e) => setParseDateTimeZone(e.target.value)}
                >
                  <option value={atTimeZone}>
                    本地时区 (UTC +{utcOffset})
                  </option>
                  <option value="UTC">UTC +0</option>
                  {timeZoneOptions()}
                </select>
              </label>
              <input
                id="datetime"
                class="input flex-1 [appearance:textfield] font-mono text-lg font-bold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="选择时间"
                value={dateTime()}
                readOnly
              />
            </Flex>
            <fieldset class="fieldset bg-base-200 rounded-box w-full p-4">
              <legend class="fieldset-legend">转换结果</legend>
              <label class="label">UNIX 时间戳 (秒)</label>
              <ClickCopyButton
                class="w-full"
                value={`${parseDateTimeResult().seconds ?? "-"}`}
              />

              <label class="label">UNIX 时间戳 (毫秒)</label>
              <ClickCopyButton
                class="w-full"
                value={`${parseDateTimeResult().milliseconds ?? "-"}`}
              />

              <label class="label">UNIX 时间戳 (微秒)</label>
              <ClickCopyButton
                class="w-full"
                value={`${parseDateTimeResult().microseconds ?? "-"}`}
              />
            </fieldset>
          </>,
        ]}
      />
    </Container>
  );
}

const ClickCopyButton = (props: {
  value: string;
  class?: string;
  mono?: boolean;
}) => {
  const [handle, setHandle] = createSignal<number | null>(null);
  return (
    <div class="tooltip" data-tip="点击复制">
      <button
        class={twMerge(
          "btn border-base-content/20 justify-start border text-lg font-bold",
          props.class,
          (props.mono ?? true) ? "font-mono" : "",
        )}
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
    </div>
  );
};
