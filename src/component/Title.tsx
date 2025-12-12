import { twMerge } from "tailwind-merge";

export default function Title(props: { value: string; class?: string }) {
  return (
    <span class={twMerge("text-sm font-bold", props.class)}>{props.value}</span>
  );
}
