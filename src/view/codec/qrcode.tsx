import { decodeQrCode, encodeQrCode } from "@/command/codec/qrcode";
import { saveBase64Image } from "@/command/fs";
import {
  Base64ImageButtons,
  OpenBase64ImageButton,
  PickImageFileButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Flex from "@/component/Flex";
import Main from "@/component/Main";
import { stringify } from "@/lib/util";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeftRight, Image, Save } from "lucide-solid";
import {
  batch,
  createResource,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import { twMerge } from "tailwind-merge";

export default function QRCodeCodec() {
  const [file, setFile] = createSignal("");
  const [encode, setEncode] = createSignal(true);
  const decode = () => !encode();

  // 切换操作模式
  const switchEncode = (value: boolean) => {
    batch(() => {
      setFile("");
      setEncode(value);
    });
  };

  // 解码
  const [text, { mutate: setText }] = createResource(
    () => (decode() ? { file: file() } : false),
    ({ file }) => {
      if (file) {
        return decodeQrCode(file).catch(stringify);
      }
    },
    { initialValue: "" },
  );

  // 编码
  const [qrcode] = createResource(
    () => (encode() ? { text: text() } : false),
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
            value={encode()}
            onChange={switchEncode}
            on="编码"
            off="解码"
          />
        </Config.Option>
      </Config.Card>

      <Main>
        <Card
          class={twMerge("h-full w-0 flex-1", encode() ? "order-2" : "order-3")}
          title="文本"
          loading={text.loading}
          operation={
            <Switch>
              <Match when={encode()}>
                <TextWriteButtons callback={setText} />
              </Match>
              <Match when={decode()}>
                <TextReadButtons value={text()} />
              </Match>
            </Switch>
          }
        >
          <Switch>
            <Match when={encode()}>
              <Editor
                value={text()}
                wordWrap="on"
                onChange={setText}
                placeholder="输入要编码的文本"
              />
            </Match>
            <Match when={decode()}>
              <Editor value={text()} readOnly={true} wordWrap="on" />
            </Match>
          </Switch>
        </Card>

        <Card
          class={twMerge("h-full w-0 flex-1", decode() ? "order-2" : "order-3")}
          title="二维码"
          loading={qrcode.loading}
          operation={
            <Switch>
              <Match when={decode()}>
                <PickImageFileButton onPick={(file) => file && setFile(file)} />
              </Match>
              <Match when={encode() && qrcode.state !== "errored" && qrcode()}>
                <Base64ImageButtons
                  base64={qrcode()!.base64}
                  extension={qrcode()!.extension}
                />
              </Match>
            </Switch>
          }
        >
          <div class="border-base-content/20 bg-base-100 flex flex-1 items-center justify-center overflow-hidden rounded-md border p-2">
            <Switch>
              <Match when={encode()}>
                <Switch>
                  <Match when={qrcode.state === "errored"}>
                    <span>{stringify(qrcode.error)}</span>
                  </Match>
                  <Match when={qrcode.state === "ready"}>
                    <Show
                      when={qrcode.state !== "errored" && qrcode()}
                      fallback={
                        <span class="text-warning flex items-center justify-center gap-2 text-sm">
                          <Image size={16} />
                          输入文本生成二维码
                        </span>
                      }
                    >
                      <img
                        src={`data:image/${qrcode()!.extension};base64,${qrcode()!.base64}`}
                        class="size-full object-scale-down"
                      />
                    </Show>
                  </Match>
                </Switch>
              </Match>
              <Match when={decode()}>
                <Show
                  when={file()}
                  fallback={
                    <span class="text-warning flex items-center justify-center gap-2 text-sm">
                      <Image size={16} />
                      选择需要解码的二维码
                    </span>
                  }
                >
                  <img
                    src={convertFileSrc(file())}
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
