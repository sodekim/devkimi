import { twMerge } from "tailwind-merge";
import { accessor, MaybeAccessor } from "../../utils/accessor";

export function Input({
  class: _class,
  value,
  onInput,
}: {
  class?: string;
  value: MaybeAccessor<string>;
  onInput?: (value: string) => void;
}) {
  const _value = accessor(value);
  return (
    <input
      class={twMerge("input input-sm outline-none", _class)}
      value={_value()}
      onInput={(e) => onInput && onInput(e.target.value)}
    />
  );
}

export function NumberInput({
  class: _class,
  placeholder,
  min,
  max,
  value,
  onInput,
}: {
  class?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  value: MaybeAccessor<number>;
  onInput?: (value: number) => void;
}) {
  const _value = accessor(value);
  return (
    <input
      type="number"
      placeholder={placeholder}
      class={twMerge("input input-sm rounded-md outline-none", _class)}
      value={_value()}
      min={min}
      max={max}
      onInput={(e) => onInput && onInput(e.target.valueAsNumber)}
    />
  );
}
