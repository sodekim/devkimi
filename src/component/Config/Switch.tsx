import { createMemo } from "solid-js";

export default function Switch(props: {
  value: boolean;
  on?: string;
  off?: string;
  onChange?: (value: boolean) => void;
}) {
  const label = createMemo(() =>
    props.value ? props.on || "开启" : props.off || "关闭",
  );
  return (
    <label class="label text-base-content text-sm">
      {label()}
      <input
        type="checkbox"
        checked={props.value}
        class="toggle toggle-primary toggle-sm"
        onChange={(e) => props.onChange && props.onChange(e.target.checked)}
      />
    </label>
  );
}
