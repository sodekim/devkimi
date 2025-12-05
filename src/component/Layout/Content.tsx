import { JSX } from "solid-js";
import Breadcrumbs from "./Breadcrumbs";

export default function Content(props: { children?: JSX.Element }) {
  return (
    <div class="drawer-content flex h-full flex-col overflow-hidden">
      <Breadcrumbs />
      <div class="flex h-0 flex-1 overflow-hidden rounded-md p-4 bg-base-100/50">
        {props.children}
      </div>
    </div>
  );
}
