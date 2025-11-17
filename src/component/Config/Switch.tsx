export default function Switch({
  value,
  on = "开启",
  off = "关闭",
  onChange,
}: {
  value: () => boolean;
  on?: string;
  off?: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label class="label text-base-content text-sm">
      {value() ? on : off}
      <input
        type="checkbox"
        checked={value()}
        class="toggle toggle-primary toggle-sm"
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
    </label>
  );
}
