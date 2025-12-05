import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeftRight, Image, Save } from "lucide-solid";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { decodeQrCode, encodeQrCode } from "../../command/codec/qrcode";
import { copyFile } from "../../command/fs";
import {
  CopyButton,
  OpenFileButton,
  PickImageFileButton,
  SaveButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";
import IOLayout from "../../component/IOLayout";

export default function QRCodeCodec() {
  const [image, setImage] = createSignal("");
  const [text, setText] = createSignal("");
  const [encode, setEncode] = createSignal(true);
  const decode = () => !encode();
  const src = createMemo(() => image() && convertFileSrc(image()));

  createEffect(() => {
    const _ = encode();
    setImage("");
    setText("");
  });

  createEffect(() => {
    if (text().length > 0 || image().length > 0) {
      if (encode()) {
        encodeQrCode(text())
          .then(setImage)
          .catch(() => setImage(""));
      } else {
        decodeQrCode(image())
          .then(setText)
          .catch((e) => setText(e.toString()));
      }
    } else {
      setText("");
      setImage("");
    }
  });

  return (
    <div class="flex h-full flex-1 flex-col gap-4">
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
            onChange={setEncode}
            on="编码"
            off="解码"
          />
        </Config.Option>
      </Config.Card>

      <IOLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <span class="text-sm">文本</span>
              <div class="flex items-center justify-center gap-2">
                {encode() && <TextOperateButtons callback={setText} />}
                {decode() && (
                  <>
                    <CopyButton value={text()} />
                    <SaveButton value={text()} />
                  </>
                )}
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
              <span class="text-sm">二维码</span>
              <div class="flex items-center justify-center gap-2">
                {/* 选择二维码 */}
                <Show when={decode()}>
                  <PickImageFileButton
                    onPick={(file) => file && setImage(file)}
                  />
                </Show>

                {/* 保存二维码 */}
                <Show when={encode()}>
                  <button
                    class="btn btn-sm"
                    onClick={() => {
                      open({
                        title: "保存二维码",
                        directory: true,
                        multiple: false,
                      }).then((dir) => {
                        if (dir) {
                          copyFile(image(), dir);
                        }
                      });
                    }}
                  >
                    <Save size={16} />
                    保存
                  </button>
                </Show>

                {/* 打开文件 */}
                <Show when={src()}>
                  <OpenFileButton path={image()} />
                </Show>
              </div>
            </div>
            <div class="border-base-content/20 flex flex-1 items-center justify-center overflow-hidden rounded-md border p-2">
              {src() ? (
                <img src={src()} class="size-full object-scale-down" />
              ) : (
                decode() && (
                  <span class="text-warning flex items-center justify-center gap-2 text-sm">
                    <Image size={16} />
                    未选择二维码
                  </span>
                )
              )}
            </div>
          </>,
        ]}
      />
    </div>
  );
}
