import { children, JSX, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import Title from "./Title";
import Flex from "./Flex";

export default function Card(props: {
  class?: string;
  title?: JSX.Element;
  loading?: boolean;
  children?: JSX.Element;
  operation?: JSX.Element;
  notification?: JSX.Element;
}) {
  const mc = children(() => props.children);
  const tc = children(() => props.title);
  const oc = children(() => props.operation);
  const nc = children(() => props.notification);
  return (
    <div class={twMerge("flex flex-col gap-2 px-4 py-2", props.class)}>
      <div class="flex items-center justify-between">
        <Show when={props.title}>
          <Flex>
            <Title loading={props.loading}>{tc()}</Title>
            <Show when={props.notification}>{nc()}</Show>
          </Flex>
        </Show>
        <Show when={props.operation}>{oc()}</Show>
      </div>
      {mc()}
    </div>
  );
}
