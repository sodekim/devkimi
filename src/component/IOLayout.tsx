import { For, JSX, Match, Switch } from "solid-js";
import { useSettings } from "@/store";
import Card from "./Card";

export default function IOLayout(props: { items: JSX.Element[] }) {
  const [settings] = useSettings();
  return (
    <Switch>
      <Match when={settings.common.ioLayout === "vertical"}>
        <div class="flex h-0 flex-1 flex-col gap-4">
          <For each={props.items}>
            {(item) => <Card class="h-0 w-full flex-1">{item}</Card>}
          </For>
        </div>
      </Match>
      <Match when={settings.common.ioLayout === "horizontal"}>
        <div class="flex h-0 flex-1 flex-row gap-4">
          <For each={props.items}>
            {(item) => <Card class="h-full w-0 flex-1">{item}</Card>}
          </For>
        </div>
      </Match>
    </Switch>
  );
}
