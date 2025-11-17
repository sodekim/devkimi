import _ from "lodash";
import { Accessor, createMemo, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children?: JSX.Element;
  class?: string | Accessor<string>;
}

export default function Container(props: ContainerProps) {
  const id = _.uniqueId("container-");
  const _class = createMemo(() => {
    let _class = "flex flex-col gap-2 px-4 py-2 bg-base-100 rounded-md p-4";
    if (props.class) {
      if (typeof props.class === "string") {
        _class = twMerge(_class, props.class);
      } else if (typeof props.class === "function") {
        _class = twMerge(_class, props.class());
      }
    }
    return _class;
  });

  return (
    <div id={id} class={_class()}>
      {props.children}
    </div>
  );
}
