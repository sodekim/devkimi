import { For } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Select<T = number | string>(props: {
  value: T;
  options:
    | {
        label: string;
        value: T;
      }[]
    | undefined;
  class?: string;
  onChange?: (value: T) => void;
}) {
  const isNumberic = typeof props.value === "number";
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
      <For each={props.options}>
        {({ label, value }) => (
          <option value={`${value}`} selected={props.value === value}>
            {label}
          </option>
        )}
      </For>
    </select>
  );
}
