import { createMemo, For } from "solid-js";
import { twMerge } from "tailwind-merge";

function isStringArray(options: any): options is string[] {
  return (
    Array.isArray(options) && options.every((item) => typeof item === "string")
  );
}
export default function Select<T = number | string>(props: {
  value: T;
  options:
    | {
        label: string;
        value: T;
      }[]
    | string[]
    | undefined;
  class?: string;
  onChange?: (value: T) => void;
}) {
  const isNumberic = typeof props.value === "number";
  const options = createMemo(() =>
    isStringArray(props.options)
      ? props.options.map((item) => ({ label: item, value: item }))
      : props.options,
  );
  return (
    <select
      class={twMerge("select select-sm outline-none", props.class)}
      onChange={(e) =>
        props.onChange &&
        props.onChange(
          (isNumberic ? Number(e.target.value) : e.target.value) as T,
        )
      }
    >
      <For each={options()}>
        {({ label, value }) => (
          <option value={`${value}`} selected={props.value === value}>
            {label}
          </option>
        )}
      </For>
    </select>
  );
}
