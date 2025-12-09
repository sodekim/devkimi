import { For, Index, JSX, Match, Switch } from "solid-js";
import { useSettings } from "@/store";
import Card from "./Card";
import { twMerge } from "tailwind-merge";

export default function IOLayout(props: {
  items: JSX.Element[];
  vertical?: { full: boolean };
  horizontal?: { full: boolean };
}) {
  const [settings] = useSettings();
  return (
    <Switch>
      <Match when={settings.common.ioLayout === "vertical"}>
        <div class="flex h-0 flex-1 flex-col gap-4">
          <Index each={props.items}>
            {(item) => (
              <Card
                class={twMerge(
                  "w-full",
                  (props.vertical?.full ?? true) && "h-0 flex-1",
                )}
              >
                {item()}
              </Card>
            )}
          </Index>
        </div>
      </Match>
      <Match when={settings.common.ioLayout === "horizontal"}>
        <div class="flex h-0 flex-1 flex-row gap-4">
          <Index each={props.items}>
            {(item) => (
              <Card
                class={twMerge(
                  "h-full",
                  (props.horizontal?.full ?? true) && "w-0 flex-1",
                )}
              >
                {item()}
              </Card>
            )}
          </Index>
        </div>
      </Match>
    </Switch>
  );
}
