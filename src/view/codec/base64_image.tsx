import {
  Base64Mode,
  decodeImageBase64,
  encodeImageBase64,
} from "@/command/codec/base64";
import {
  Base64ImageButtons,
  PickImageFileButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import { convertFileSrc } from "@tauri-apps/api/core";
import { ArrowLeftRight, Image, Layers } from "lucide-solid";
import { createResource, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Base64ImageCodec() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    file: "",
    base64: "",
    mode: Base64Mode.Standard,
    encode: true,
  });

  // 是否解码
  const decode = () => !store.encode;

  // 切换操作模式
  const setEncode = (value: boolean) => {
    setStore((prev) => ({
      ...prev,
      file: "",
      base64: "",
      encode: value,
    }));
  };

  // 编码
  const [encoded] = createResource(
    () => (store.encode ? { file: store.file, mode: store.mode } : false),
    ({ file, mode }) => {
      if (file) {
        return encodeImageBase64(file, mode).catch(stringify);
      }
    },
  );

  // 解码
  const [decoded] = createResource(
    () => (decode() ? { base64: store.base64, mode: store.mode } : false),
    ({ base64, mode }) => {
      if (base64) {
        return decodeImageBase64(base64, mode).then(([base64, extension]) => ({
          base64,
          extension,
        }));
      }
    },
  );

  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/*操作配置*/}
        <Config.Option
          label="操作"
          description="选择操作的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={store.encode}
            onChange={setEncode}
            on="编码"
            off="解码"
          />
        </Config.Option>

        {/*模式配置*/}
        <Config.Option
          label="模式"
          description="选择Bas64的模式"
          icon={() => <Layers size={16} />}
        >
          <Config.Select
            class="w-35"
            value={store.mode}
            options={Object.keys(Base64Mode)}
            onChange={(value) => setStore("mode", value)}
          />
        </Config.Option>
      </Config.Card>

      {/* 操作区域 */}
      <Main>
        <Card
          class={twMerge(
            "h-full w-0 flex-1",
            store.encode ? "order-2" : "order-3",
          )}
          title="图片"
          loading={decoded.loading}
          operation={
            <Switch>
              <Match when={store.encode}>
                <PickImageFileButton
                  onPick={(file) => file && setStore("file", file)}
                />
              </Match>
              <Match when={decode()}>
                <Show when={decoded.state !== "errored" && decoded()}>
                  <Base64ImageButtons
                    base64={decoded()!.base64}
                    extension={decoded()!.extension}
                  />
                </Show>
              </Match>
            </Switch>
          }
        >
          <div class="border-base-content/20 bg-base-100 flex flex-1 items-center justify-center overflow-hidden rounded-md border p-2">
            <Switch>
              <Match when={store.encode}>
                <Show
                  when={store.file}
                  fallback={
                    <span class="text-warning flex items-center justify-center gap-2 text-sm">
                      <Image size={16} />
                      选择需要编码的图片
                    </span>
                  }
                >
                  <img
                    src={convertFileSrc(store.file)}
                    class="size-full object-scale-down"
                  />
                </Show>
              </Match>
              <Match when={decode()}>
                <Switch>
                  <Match when={decoded.state === "errored"}>
                    <span>{stringify(decoded.error)}</span>
                  </Match>
                  <Match when={decoded.state === "ready"}>
                    <Show
                      when={decoded()}
                      fallback={
                        <span class="text-warning flex items-center justify-center gap-2 text-sm">
                          <Image size={16} />
                          输入Base64生成图片
                        </span>
                      }
                    >
                      <img
                        src={`data:image/${decoded()!.extension};base64,${decoded()!.base64}`}
                        class="size-full object-scale-down"
                      />
                    </Show>
                  </Match>
                </Switch>
              </Match>
            </Switch>
          </div>
        </Card>

        <Card
          class={twMerge("h-full w-0 flex-1", decode() ? "order-2" : "order-3")}
          title="Base64"
          loading={encoded.loading}
          operation={
            <Switch>
              <Match when={store.encode}>
                <TextReadButtons value={encoded()} />
              </Match>
              <Match when={decode()}>
                <TextWriteButtons
                  callback={(value) => setStore("base64", value)}
                />
              </Match>
            </Switch>
          }
        >
          <Switch>
            <Match when={store.encode}>
              <Editor value={encoded()} readOnly={true} />
            </Match>
            <Match when={decode()}>
              <Editor
                value={store.base64}
                onChange={(value) => setStore("base64", value)}
                placeholder="输入要解码的Base64文本"
              />
            </Match>
          </Switch>
        </Card>
      </Main>
    </Container>
  );
}
