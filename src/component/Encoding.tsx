import { twMerge } from "tailwind-merge";
import { SetStoreFunction } from "solid-js/store";
import { Encoding, EncodingText } from "../command/crypto/type";

const ENCODING_OPTIONS = [
  { value: "Utf8", label: "文本 (Utf8)" },
  { value: "Hex", label: "十六进制 (Hex)" },
  { value: "Base64", label: "Base64" },
];

export function EncodingSelect(props: {
  value?: Encoding;
  class?: string;
  exclude?: Encoding[];
  onChange?: (value: Encoding) => void;
}) {
  const _exclude = props.exclude ?? [];
  return (
    <select
      class={twMerge(
        "select select-sm w-40 rounded-md outline-none",
        props.class,
      )}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value as Encoding)}
    >
      {ENCODING_OPTIONS.filter(
        (encoding) => !_exclude.includes(encoding.value as Encoding),
      ).map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export function EncodingInput(props: {
  value: EncodingText;
  setStore?: SetStoreFunction<EncodingText>;
  placeholder?: string;
  onChange?: (value: EncodingText) => void;
}) {
  return (
    <div class="join">
      <select
        class="select w-40 rounded-l-md outline-none"
        value={props.value.encoding}
        onChange={(e) =>
          props.setStore?.("encoding", e.target.value as Encoding)
        }
      >
        {ENCODING_OPTIONS.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <input
        class="input w-full rounded-r-md outline-none"
        placeholder={props.placeholder}
        value={props.value.text}
        onInput={(e) => props.setStore?.("text", e.target.value)}
      />
    </div>
  );
}
