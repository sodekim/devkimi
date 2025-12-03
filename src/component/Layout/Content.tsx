import { JSX } from "solid-js";
import Breadcrumbs from "./Breadcrumbs";

export default function Content(props: { children?: JSX.Element }) {
  return (
    <div class="drawer-content flex h-full flex-col overflow-hidden">
      <Breadcrumbs />
      <div class="border-base-300 bg-base-300 h-0 flex-1 overflow-auto rounded-md border p-4">
        {props.children}
      </div>
    </div>
  );
}
