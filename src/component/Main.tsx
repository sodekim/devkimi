import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Main(props: { children: JSX.Element; class?: string }) {
  const _children = children(() => props.children);
  return (
    <div class={twMerge("flex h-0 flex-1 flex-row", props.class)}>
      {_children()}
    </div>
  );
}
