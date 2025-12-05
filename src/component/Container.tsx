import _ from "lodash";
import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Container(props: {
  children?: JSX.Element;
  class?: string;
}) {
  const id = _.uniqueId("container-");
  const _children = children(() => props.children);
  return (
    <div
      id={id}
      class={twMerge(
        "from-base-100/95 to-base-100/80 border-base-content/10 flex flex-col gap-2 rounded-md border bg-linear-to-br px-4 py-2 backdrop-blur-sm",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
