import { For } from "solid-js";
import { twMerge } from "tailwind-merge";
import { accessor, MaybeAccessor } from "../../utils/accessor";

export default function Select({
  value,
  class: _class,
  options,
  onChange,
}: {
  value: string | (() => string);
  options: MaybeAccessor<
    | {
        label: string;
        value: string;
      }[]
    | undefined
  >;
  class?: string;
  onChange?: (value: string) => void;
}) {
  const _value = accessor(value);
  const _options = accessor(options);
  return (
    <select
      class={twMerge("select select-sm outline-none", _class)}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      <For each={_options()}>
        {({ label, value }) => (
          <option value={value} selected={_value() === value}>
            {label}
          </option>
        )}
      </For>
    </select>
  );
}
