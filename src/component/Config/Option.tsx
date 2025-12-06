import { children, JSX, Show } from "solid-js";

export default function Option(props: {
  icon: () => JSX.Element;
  label: string;
  description?: string;
  children?: JSX.Element;
}) {
  const _children = children(() => props.children);
  return (
    <div class="border-base-content/15 flex h-14 w-full items-center justify-between gap-2 rounded-md border p-4">
      <span class="inline-flex items-center gap-4 text-sm">
        {props.icon()}
        <div class="flex flex-col gap-1">
          <span>{props.label}</span>
          <Show when={props.description}>
            <span class="text-base-content/50 text-xs">
              {props.description}
            </span>
          </Show>
        </div>
      </span>
      {_children()}
    </div>
  );
}
