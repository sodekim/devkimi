import { JSX } from "solid-js";

export default function Option({
  children,
  icon,
  label,
  description,
}: {
  children: JSX.Element;
  icon: () => JSX.Element;
  label: string;
  description?: string;
}) {
  return (
    <div class="border-base-content/20 flex h-14 w-full items-center justify-between gap-2 rounded-md border p-4">
      <span class="inline-flex items-center gap-4 text-sm">
        {icon()}
        <div class="flex flex-col gap-1">
          <span>{label}</span>
          {description && (
            <span class="text-base-content/50 text-xs">{description}</span>
          )}
        </div>
      </span>
      {children}
    </div>
  );
}
