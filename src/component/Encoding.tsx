import { twMerge } from "tailwind-merge";
import { SetStoreFunction } from "solid-js/store";
import { Encoding, EncodingText } from "@/command/crypto/type";
import { Match, Show } from "solid-js";

const ENCODING_OPTIONS = [
  { value: "Utf8", label: "UTF-8" },
  { value: "Hex", label: "Hex" },
  { value: "Base64", label: "Base64" },
];

export function EncodingSelect(props: {
  label?: string;
  value?: Encoding;
  class?: string;
  exclude?: Encoding[];
  onChange?: (value: Encoding) => void;
}) {
  const select = () => (
    <select
      class={twMerge(
        "select select-sm w-25 rounded-md outline-none",
        props.class,
      )}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value as Encoding)}
    >
      {ENCODING_OPTIONS.filter(
        (encoding) =>
          !(props.exclude ?? []).includes(encoding.value as Encoding),
      ).map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
  );
  return (
    <Show when={props.label} fallback={select()}>
      <label class="select select-sm rounded-md outline-none">
        <span class="label text-base-content text-sm">{props.label}</span>
        {select()}
      </label>
    </Show>
  );
}

export function EncodingTextInput(props: {
  value: EncodingText;
  placeholder?: string;
  onEncodingChange?: (value: Encoding) => void;
  onTextChange?: (value: string) => void;
}) {
  return (
    <div class="join gap-2">
      <label class="select select-md w-40 rounded-md outline-none">
        <span class="label text-base-content text-sm">格式</span>
        <select
          class="select select-md rounded-md"
          value={props.value.encoding}
          onChange={(e) => props.onEncodingChange?.(e.target.value as Encoding)}
        >
          {ENCODING_OPTIONS.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <input
        class="input input-md flex-1 rounded-md outline-none"
        placeholder={props.placeholder}
        value={props.value.text}
        onInput={(e) => props.onTextChange?.(e.target.value)}
      />
    </div>
  );
}
