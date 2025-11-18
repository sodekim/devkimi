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
        "bg-base-100 flex flex-col gap-2 rounded-md p-4 px-4 py-2",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
