import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Card(props: {
  children?: JSX.Element;
  class?: string;
}) {
  const _children = children(() => props.children);
  return (
    <div class={twMerge("flex flex-col gap-2 px-4 py-2", props.class)}>
      {_children()}
    </div>
  );
}
