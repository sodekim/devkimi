import { Title } from "@solidjs/meta";
import { useCurrentMatches } from "@solidjs/router";
import { last } from "lodash";
import { createMemo } from "solid-js";

export default function Breadcrumbs() {
  const matches = useCurrentMatches();
  const title = createMemo(() => last(matches())?.route.info?.label);
  const breadcrumbs = createMemo(() =>
    matches().map((m) => (
      <li>
        <span class="text-sm font-bold">
          {m.route.info?.icon && m.route.info.icon({ size: 14 })}
          {m.route.info?.label && m.route.info.label}
        </span>
      </li>
    )),
  );
  return (
    <div class="breadcrumbs p-4 text-sm">
      <Title>{title()}</Title>
      <ul>{breadcrumbs()}</ul>
    </div>
  );
}
