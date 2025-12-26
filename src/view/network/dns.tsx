import { queryDns } from "@/command/network/dns";
import { CopyButton } from "@/component/Buttons";
import Container from "@/component/Container";
import Flex from "@/component/Flex";
import { Laptop, Search } from "lucide-solid";
import {
  createMemo,
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";

export default function DNSQuery() {
  // 页面参数
  const [name, setName] = createSignal("");

  // 查询结果
  const [response, { refetch }] = createResource(() => {
    if (name()) {
      return queryDns(name());
    }
  });

  // A记录
  const ipv4 = createMemo(() => response()?.v4 ?? []);

  // AAAA记录
  const ipv6 = createMemo(() => response()?.v6 ?? []);

  // CNAME记录
  const cname = createMemo(() => response()?.cname ?? []);

  return (
    <Container>
      <Flex gap={4}>
        <label class="input w-full outline-none">
          <span class="label">
            <Laptop size={16} />
          </span>
          <input
            class="flex-1 font-mono text-lg font-bold outline-none"
            onInput={(e) => setName(e.target.value)}
            placeholder="www.example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                refetch();
              }
            }}
          />
          <kbd class="kbd kbd-sm">⏎</kbd>
        </label>
        <button class="btn btn-primary" onClick={() => refetch()}>
          查询
        </button>
      </Flex>

      <Switch>
        <Match when={response.loading}>
          <Loading />
        </Match>

        <Match when={response.state === "errored"}>
          <Notice message={response.error} />
        </Match>

        <Match when={response.state === "ready"}>
          <Records label="A 记录 (IPV4)" value={ipv4()} />
          <Records label="AAAA 记录 (IPV6)" value={ipv6()} />
          <Records label="CNAME 记录" value={cname()} />
        </Match>
      </Switch>
    </Container>
  );
}

const Records = (props: { label: string; value: string[] }) => {
  return (
    <div>
      <div class="bg-base-100 border-base-content/20 flex items-center justify-between rounded-t-md border p-2">
        <span class="text-sm font-bold">{props.label}</span>
        <CopyButton value={props.value.join("\n")} />
      </div>
      <div class="border-base-content/20 flex flex-col rounded-b-md border p-2 text-sm font-bold">
        <Show
          when={props.value.length > 0}
          fallback={<span class="text-sm font-bold">无记录</span>}
        >
          <For each={props.value}>
            {(item) => <span class="font-mono text-sm font-bold">{item}</span>}
          </For>
        </Show>
      </div>
    </div>
  );
};

const Notice = (props: { message: string; loading?: boolean }) => {
  return (
    <div class="border-base-content/20 flex h-50 items-center justify-center rounded-md border">
      <span class="text-warning flex items-center justify-center gap-2 p-4">
        <Search size={16} />
        <span class="text-sm font-bold">{props.message}</span>
      </span>
    </div>
  );
};

const Loading = () => {
  return (
    <div class="border-base-content/20 flex h-50 items-center justify-center gap-2 rounded-md border">
      <span class="loading loading-bars loading-sm text-primary"></span>
      <span class="text-sm font-bold">查询中...</span>
    </div>
  );
};
