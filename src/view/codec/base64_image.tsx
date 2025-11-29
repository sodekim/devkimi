import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeftRight, Image, Layers, Save } from "lucide-solid";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import {
  decodeImageBase64,
  encodeImageBase64,
} from "../../command/codec/base64_image";
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

const BASE_MODE_OPTIONS = [
  { label: "Standard", value: "Standard" },
  { label: "StandardNoPad", value: "StandardNoPad" },
  { label: "UrlSafe", value: "UrlSafe" },
  { label: "UrlSafeNoPad", value: "UrlSafeNoPad" },
];

export default function Base64ImageCodec() {
  const [image, setImage] = createSignal("");
  const [base64, setBase64] = createSignal("");
  const [mode, setMode] = createSignal("Standard");
  const [encode, setEncode] = createSignal(true);
  const decode = () => !encode();
  const src = createMemo(() => image() && convertFileSrc(image()));

  createEffect(() => {
    const _ = encode();
    setImage("");
    setBase64("");
  });

  createEffect(() => {
    if ((encode() && image()) || (decode() && base64())) {
      if (encode()) {
        encodeImageBase64(image(), mode())
          .then(setBase64)
          .catch((e) => setBase64(e.toString()));
      } else {
        decodeImageBase64(base64(), mode())
          .then(setImage)
          .catch((e) => setImage(""));
      }
    } else {
      setBase64("");
      setImage("");
    }
  });
  return (
    <div class="flex h-full flex-col gap-4">
      {/* 配置 */}
      <Config.Card>
        {/*转换配置*/}
        <Config.Option
          label="转换"
          description="选择转换的类型"
          icon={() => <ArrowLeftRight size={16} />}
        >
          <Config.Switch
            value={encode()}
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
            value={mode()}
            options={BASE_MODE_OPTIONS}
            onChange={setMode}
          />
        </Config.Option>
      </Config.Card>

      {/*图片*/}
      <Container class={encode() ? "order-2 h-0 flex-1" : "order-3 h-0 flex-1"}>
        <div class="flex items-center justify-between">
          <span class="text-sm">图片</span>
          <div class="flex items-center justify-center gap-2">
            {/* 选择图片 */}
            <Show when={encode()}>
              <PickImageFileButton onPick={(file) => file && setImage(file)} />
            </Show>

            {/* 保存图片 */}
            <Show when={decode()}>
              <button
                class="btn btn-sm"
                onClick={() => {
                  open({
                    title: "保存图片",
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
            encode() && (
              <span class="text-warning flex items-center justify-center gap-2 text-sm">
                <Image size={16} />
                选择需要转换的图片
              </span>
            )
          )}
        </div>
      </Container>

      {/*Base64*/}
      <Container class={encode() ? "order-3 h-0 flex-1" : "order-2 h-0 flex-1"}>
        <div class="flex items-center justify-between">
          <span class="text-sm">Base64</span>
          <div class="flex items-center justify-center gap-2">
            {encode() && (
              <>
                <CopyButton value={base64()} />
                <SaveButton value={base64()} />
              </>
            )}
            {decode() && <TextOperateButtons callback={setBase64} />}
          </div>
        </div>
        {encode() ? (
          <Editor value={base64()} readOnly={true} wordWrap="on" />
        ) : (
          <Editor
            value={base64()}
            wordWrap="on"
            onChange={setBase64}
            placeholder="输入要解码的Base64文本"
          />
        )}
      </Container>
    </div>
  );
}
