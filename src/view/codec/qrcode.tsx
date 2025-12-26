import { decodeQrCode, encodeQrCode } from "@/command/codec/qrcode";
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
import { ArrowLeftRight, Image } from "lucide-solid";
import { createResource, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function QRCodeCodec() {
  // 页面参数
  const [store, setStore] = createCachableStore({
    file: "",
    text: "",
    encode: true,
  });

  // 是否解码
  const decode = () => !store.encode;

  // 切换操作模式
  const setEncode = (value: boolean) => {
    setStore((prev) => ({ ...prev, file: "", text: "", encode: value }));
  };

  // 解码
  const [decoded] = createResource(
    () => (decode() ? { file: store.file } : false),
    ({ file }) => {
      if (file) {
        return decodeQrCode(file).catch(stringify);
      }
    },
    { initialValue: "" },
  );

  // 编码
  const [encoded] = createResource(
    () => (store.encode ? { text: store.text } : false),
    ({ text }) => {
      if (text) {
        return encodeQrCode(text).then(([base64, extension]) => ({
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
      </Config.Card>

      <Main>
        <Card
          class={twMerge(
            "h-full w-0 flex-1",
            store.encode ? "order-2" : "order-3",
          )}
          title="文本"
          loading={decoded.loading}
          operation={
            <Switch>
              <Match when={store.encode}>
                <TextWriteButtons
                  callback={(value) => setStore("text", value)}
                />
              </Match>
              <Match when={decode()}>
                <TextReadButtons value={decoded()} />
              </Match>
            </Switch>
          }
        >
          <Switch>
            <Match when={store.encode}>
              <Editor
                value={store.text}
                wordWrap="on"
                onChange={(value) => setStore("text", value)}
                placeholder="输入要编码的文本"
              />
            </Match>
            <Match when={decode()}>
              <Editor value={decoded()} readOnly={true} />
            </Match>
          </Switch>
        </Card>

        <Card
          class={twMerge("h-full w-0 flex-1", decode() ? "order-2" : "order-3")}
          title="二维码"
          loading={encoded.loading}
          operation={
            <Switch>
              <Match when={decode()}>
                <PickImageFileButton
                  onPick={(file) => file && setStore("file", file)}
                />
              </Match>
              <Match
                when={store.encode && encoded.state !== "errored" && encoded()}
              >
                <Base64ImageButtons
                  base64={encoded()!.base64}
                  extension={encoded()!.extension}
                />
              </Match>
            </Switch>
          }
        >
          <div class="border-base-content/20 bg-base-100 flex flex-1 items-center justify-center overflow-hidden rounded-md border p-2">
            <Switch>
              <Match when={store.encode}>
                <Switch>
                  <Match when={encoded.state === "errored"}>
                    <span>{stringify(encoded.error)}</span>
                  </Match>
                  <Match when={encoded.state === "ready"}>
                    <Show
                      when={encoded.state !== "errored" && encoded()}
                      fallback={
                        <span class="text-warning flex items-center justify-center gap-2 text-sm">
                          <Image size={16} />
                          输入文本生成二维码
                        </span>
                      }
                    >
                      <img
                        src={`data:image/${encoded()!.extension};base64,${encoded()!.base64}`}
                        class="size-full object-scale-down"
                      />
                    </Show>
                  </Match>
                </Switch>
              </Match>
              <Match when={decode()}>
                <Show
                  when={store.file}
                  fallback={
                    <span class="text-warning flex items-center justify-center gap-2 text-sm">
                      <Image size={16} />
                      选择需要解码的二维码
                    </span>
                  }
                >
                  <img
                    src={convertFileSrc(store.file)}
                    class="size-full object-scale-down"
                  />
                </Show>
              </Match>
            </Switch>
          </div>
        </Card>
      </Main>
    </Container>
  );
}
