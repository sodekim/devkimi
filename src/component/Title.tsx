import { children, JSX, Show } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Title(props: {
  children: JSX.Element;
  class?: string;
  loading?: boolean;
}) {
  const _children = children(() => props.children);
  return (
    <span
      class={twMerge(
        "inline-flex h-8 items-center justify-center gap-2 text-center text-sm leading-8 font-bold",
        props.class,
      )}
    >
      {_children()}
      <Show when={props.loading}>
        <span class="loading loading-bars loading-xs text-primary"></span>
      </Show>
    </span>
  );
}
