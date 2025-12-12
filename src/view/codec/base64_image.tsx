import {
  Base64Mode,
  decodeImageBase64,
  encodeImageBase64,
} from "@/command/codec/base64";
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
import { ArrowLeftRight, Image, Layers, Save } from "lucide-solid";
import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";

export default function Base64ImageCodec() {
  const [file, setFile] = createSignal("");
  const [base64, setBase64] = createSignal("");
  const [base64Image, setBase64Image] = createSignal<{
    base64: string;
    extension: string;
  }>();
  const [mode, setMode] = createSignal<Base64Mode>(Base64Mode.Standard);
  const [encode, _setEncode] = createSignal(true);
  const decode = createMemo(() => !encode());

  const setEncode = (value: boolean) => {
    batch(() => {
      setFile("");
      setBase64("");
      setBase64Image();
      _setEncode(value);
    });
  };

  // 编码
  createEffect(() => {
    if (encode()) {
      if (file()) {
        encodeImageBase64(file(), mode())
          .then(setBase64)
          .catch((e) => setBase64(e.toString()));
      } else {
        setBase64("");
      }
    }
  });

  // 解码
  createEffect(() => {
    if (decode()) {
      if (base64()) {
        decodeImageBase64(base64(), mode()).then(([base64, extension]) =>
          setBase64Image({ base64, extension }),
        );
      } else {
        setBase64Image();
      }
    }
  });

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
            options={Object.keys(Base64Mode)}
            onChange={setMode}
          />
        </Config.Option>
      </Config.Card>

      <MainLayout
        items={[
          <>
            <div class="flex items-center justify-between">
              <Title value="图片" />
              <div class="flex items-center justify-center gap-2">
                {/* 选择图片 */}
                <Show when={encode()}>
                  <PickImageFileButton
                    onPick={(file) => file && setFile(file)}
                  />
                </Show>

                {/* 保存图片 */}
                <Show when={decode() && base64Image()}>
                  <button
                    class="btn btn-sm"
                    onClick={() => {
                      open({
                        title: "保存图片",
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
                  <Show
                    when={base64Image()}
                    fallback={
                      <span class="text-warning flex items-center justify-center gap-2 text-sm">
                        <Image size={16} />
                        输入Base64生成图片
                      </span>
                    }
                  >
                    <img
                      src={`data:image/${base64Image()!.extension};base64,${base64Image()!.base64}`}
                      class="size-full object-scale-down"
                    />
                  </Show>
                </Match>
              </Switch>
            </div>
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="Base64" />
              {encode() && <TextReadButtons value={base64()} />}
              {decode() && <TextWriteButtons callback={setBase64} />}
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
          </>,
        ]}
      />
    </Container>
  );
}
