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
import { stringify } from "@/lib/util";
import { convertFileSrc } from "@tauri-apps/api/core";
import { ArrowLeftRight, Image, Layers } from "lucide-solid";
import {
  batch,
  createResource,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Base64ImageCodec() {
  const [file, setFile] = createSignal("");
  const [mode, setMode] = createSignal<Base64Mode>(Base64Mode.Standard);
  const [encode, setEncode] = createSignal(true);
  const decode = () => !encode();

  // 切换操作模式
  const switchEncode = (value: boolean) => {
    batch(() => {
      setFile("");
      setBase64("");
      setEncode(value);
    });
  };

  // 编码
  const [base64, { mutate: setBase64 }] = createResource(
    () => (encode() ? { file: file(), mode: mode() } : false),
    ({ file, mode }) => {
      if (file) {
        return encodeImageBase64(file, mode).catch(stringify);
      }
    },
  );

  // 解码
  const [image] = createResource(
    () => (decode() ? { base64: base64(), mode: mode() } : false),
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
            value={encode()}
            onChange={switchEncode}
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
            value={mode()}
            options={Object.keys(Base64Mode)}
            onChange={setMode}
          />
        </Config.Option>
      </Config.Card>

      {/* 操作区域 */}
      <Main>
        <Card
          class={twMerge("h-full w-0 flex-1", encode() ? "order-2" : "order-3")}
          title="图片"
          loading={image.loading}
          operation={
            <Switch>
              <Match when={encode()}>
                <PickImageFileButton onPick={(file) => file && setFile(file)} />
              </Match>
              <Match when={decode()}>
                <Show when={image.state !== "errored" && image()}>
                  <Base64ImageButtons
                    base64={image()!.base64}
                    extension={image()!.extension}
                  />
                </Show>
              </Match>
            </Switch>
          }
        >
          <div class="border-base-content/20 bg-base-100 flex flex-1 items-center justify-center overflow-hidden rounded-md border p-2">
            <Switch>
              <Match when={encode()}>
                <Show
                  when={file()}
                  fallback={
                    <span class="text-warning flex items-center justify-center gap-2 text-sm">
                      <Image size={16} />
                      选择需要编码的图片
                    </span>
                  }
                >
                  <img
                    src={convertFileSrc(file())}
                    class="size-full object-scale-down"
                  />
                </Show>
              </Match>
              <Match when={decode()}>
                <Switch>
                  <Match when={image.state === "errored"}>
                    <span>{stringify(image.error)}</span>
                  </Match>
                  <Match when={image.state === "ready"}>
                    <Show
                      when={image()}
                      fallback={
                        <span class="text-warning flex items-center justify-center gap-2 text-sm">
                          <Image size={16} />
                          输入Base64生成图片
                        </span>
                      }
                    >
                      <img
                        src={`data:image/${image()!.extension};base64,${image()!.base64}`}
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
          loading={base64.loading}
          operation={
            <Switch>
              <Match when={encode()}>
                <TextReadButtons value={base64()} />
              </Match>
              <Match when={decode()}>
                <TextWriteButtons callback={setBase64} />
              </Match>
            </Switch>
          }
        >
          <Switch>
            <Match when={encode()}>
              <Editor value={base64()} readOnly={true} />
            </Match>
            <Match when={decode()}>
              <Editor
                value={base64()}
                wordWrap="on"
                onChange={setBase64}
                placeholder="输入要解码的Base64文本"
              />
            </Match>
          </Switch>
        </Card>
      </Main>
    </Container>
  );
}
