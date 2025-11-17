import { JSX } from "solid-js";
import Content from "./Content";
import Sidebar from "./Siderbar";

export default function Layout(props: { children?: JSX.Element }) {
  return (
    <div class="drawer drawer-open bg-base-100 h-full">
      <input
        id="sidebar"
        type="checkbox"
        class="drawer-toggle"
        name="drawer-toggle"
        placeholder="Drawer Toggle"
        checked={true}
      />

      {/* Drawer Content */}
      <Content>{props.children}</Content>

      {/* Drawer Sidebar */}
      <Sidebar />
    
    </div>
  );
}
