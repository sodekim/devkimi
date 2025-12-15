import { children, JSX, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import Title from "./Title";

export default function Card(props: {
  class?: string;
  title?: JSX.Element;
  loading?: boolean;
  children?: JSX.Element;
  operation?: JSX.Element;
}) {
  const mc = children(() => props.children);
  const tc = children(() => props.title);
  const oc = children(() => props.operation);
  return (
    <div class={twMerge("flex flex-col gap-2 px-4 py-2", props.class)}>
      <div class="flex items-center justify-between">
        <Show when={props.title}>
          <Title loading={props.loading}>{tc()}</Title>
        </Show>
        <Show when={props.operation}>{oc()}</Show>
      </div>
      {mc()}
    </div>
  );
}
