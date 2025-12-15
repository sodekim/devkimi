import { decodeQrCode, encodeQrCode } from "@/command/codec/qrcode";
import { saveBase64Image } from "@/command/fs";
import {
  OpenBase64Image,
  PickImageFileButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import MainLayout from "@/component/IOLayout";
import Title from "@/component/Title";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeftRight, Image, Save } from "lucide-solid";
import {
  batch,
  createEffect,
  createResource,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";

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

  // 编码
  const [qrcode] = createResource(
    () => (encode() ? { text: text() } : false),
    ({ text }) => {
      if (text) {
        return encodeQrCode(text)
          .then(([base64, extension]) => ({ base64, extension }));
      }
    }
  );

  // 解码
  const [text, { mutate: setText }] = createResource(
    () => (decode() ? { file: file() } : false),
    ({ file }) => {
      if (file) {
        return decodeQrCode(file);
      }
    },
    { initialValue: "" });

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

      <MainLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title value="文本" />
              <div class="flex items-center justify-center gap-2">
                {encode() && <TextWriteButtons callback={setText} />}
                {decode() && <TextReadButtons value={text()} />}
              </div>
            </div>
            {encode() ? (
              <Editor
                value={text()}
                wordWrap="on"
                onChange={setText}
                placeholder="输入要编码的文本"
              />
            ) : (
              <Editor value={text()} readOnly={true} wordWrap="on" />
            )}
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="二维码" />
              <div class="flex items-center justify-center gap-2">
                {/* 选择二维码 */}
                <Show when={decode()}>
                  <PickImageFileButton
                    onPick={(file) => file && setFile(file)}
                  />
                </Show>

                {/* 保存二维码 */}
                <Show when={encode() && base64Image()}>
                  <button
                    class="btn btn-sm"
                    onClick={() => {
                      open({
                        title: "保存二维码",
                        directory: true,
                        multiple: false,
                      }).then((dir) => {
                        if (dir) {
                          saveBase64Image(
                            dir,
                            base64Image()!.base64,
                            base64Image()!.extension,
                          );
                        }
                      });
                    }}
                  >
                    <Save size={16} />
                    保存
                  </button>
                </Show>

                {/* 打开文件 */}
                <Show when={base64Image()}>
                  <OpenBase64Image
                    base64={base64Image()!.base64}
                    extension={base64Image()!.extension}
                  />
                </Show>
              </div>
            </div>
            <div class="border-base-content/20 bg-base-100 flex flex-1 items-center justify-center overflow-hidden rounded-md border p-2">
              <Switch>
                <Match when={encode()}>
                  <Show
                    when={base64Image()}
                    fallback={
                      <span class="text-warning flex items-center justify-center gap-2 text-sm">
                        <Image size={16} />
                        输入文本生成二维码
                      </span>
                    }
                  >
                    <img
                      src={`data:image/${base64Image()!.extension};base64,${base64Image()!.base64}`}
                      class="size-full object-scale-down"
                    />
                  </Show>
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
          </>,
        ]}
      />
    </Container>
  );
}
