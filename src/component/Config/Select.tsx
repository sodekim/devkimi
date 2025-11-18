import { For } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Select(props: {
  value: string;
  options:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  class?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <select
      class={twMerge("select select-sm outline-none", props.class)}
      onChange={(e) => props.onChange && props.onChange(e.target.value)}
    >
      <For each={props.options}>
        {({ label, value }) => (
          <option value={value} selected={props.value === value}>
            {label}
          </option>
        )}
      </For>
    </select>
  );
}
