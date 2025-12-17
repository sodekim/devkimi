import { createEffect, createSignal, For, JSX } from "solid-js";
import Split from "split.js";
import "./splitter.css";

interface SplitterProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
  direction?: "horizontal" | "vertical";
  sizes?: number[];
  gutterSize?: number;
  minSize?: number;
  expandToMin?: boolean;
  children: JSX.Element;
}

export default function Splitter(props: SplitterProps) {
  const [refs, setRefs] = createSignal<HTMLElement[]>([]);
  createEffect(() => {
    if (refs().length > 0) {
      const split = Split(refs(), {
        direction: props.direction,
        sizes: props.sizes,
        gutterSize: props.gutterSize,
        minSize: props.minSize ?? 0,
        expandToMin: props.expandToMin,
      });

      setTimeout(() => {
        split.collapse(0);
      }, 10000);
    }
  });

  return (
    <For each={props.children as Array<JSX.Element>}>
      {(child, index) => (
        <div
          ref={(e) => {
            const _refs = [...refs()];
            _refs[index()] = e;
            setRefs(_refs);
          }}
        >
          {child}
        </div>
      )}
    </For>
  );
}
