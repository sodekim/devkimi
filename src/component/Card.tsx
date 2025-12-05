import _ from "lodash";
import { children, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Card(props: {
  children?: JSX.Element;
  class?: string;
}) {
  const id = _.uniqueId("container-");
  const _children = children(() => props.children);
  return (
    <div
      id={id}
      class={twMerge(
        "flex flex-col gap-2 px-4 py-2",
        props.class,
      )}
    >
      {_children()}
    </div>
  );
}
