import { twMerge } from "tailwind-merge";

export function Input(props: {
  class?: string;
  value: string;
  onInput?: (value: string) => void;
}) {
  return (
    <input
      class={twMerge(
        "input input-sm font-mono font-bold outline-none",
        props.class,
      )}
      value={props.value}
      onInput={(e) => props.onInput?.(e.target.value)}
    />
  );
}

export function NumberInput(props: {
  class?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  value: number;
  onInput?: (value: number) => void;
}) {
  return (
    <input
      type="number"
      placeholder={props.placeholder}
      class={twMerge(
        "input input-sm rounded-md font-mono font-bold outline-none",
        props.class,
      )}
      value={props.value}
      min={props.min}
      max={props.max}
      onInput={(e) => props.onInput?.(e.target.valueAsNumber)}
    />
  );
}
