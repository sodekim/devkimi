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
import Card from "@/component/Card";
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
  createResource,
  createSignal,
  Match,
  Show,
  Switch
} from "solid-js";

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
        return encodeImageBase64(file, mode);
      }
    }
  );

  // 解码
  const [image] = createResource(
    () => (decode() ? { base64: base64(), mode: mode() } : false),
    ({ base64, mode }) => {
      if (base64) {
        return decodeImageBase64(base64, mode)
          .then(([base64, extension]) => ({ base64, extension }))
      }
    },
  );

  createEffect(() => console.log(image));

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

      <Card class="px-4 py-0">
        <Switch>
          <Match when={base64.state === "errored"}>
            <div class="border border-base-content/20 rounded-md p-4">
              {base64.error.toString()}
            </div>
          </Match>
          <Match when={image.state === "errored"}>
            <div class="border border-base-content/20 rounded-md p-4">
              {image.error.toString()}
            </div>
          </Match>
        </Switch>
      </Card>

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
                <Show when={image.state === "ready" && image()}>
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
                            image()!.base64,
                            image()!.extension,
                          );
                        }
                      });
                    }}
                  >
                    <Save size={16} />
                    保存
                  </button>
                  <OpenBase64Image
                    base64={image()!.base64}
                    extension={image()!.extension}
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
                  <Show when={image.state === "refreshing"}>
                    <div class="loading loading-bars loading-xs"></div>
                  </Show>

                  <Show
                    when={image.state === "ready" && image()}
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
            </div>
          </>,
          <>
            <div class="flex items-center justify-between">
              <Title value="Base64" />
              <Switch>
                <Match when={encode()}>
                  <TextReadButtons value={base64()} />
                </Match>
                <Match when={decode()}>
                  <TextWriteButtons callback={setBase64} />
                </Match>
              </Switch>
            </div>
            <Switch>
              <Match when={encode()}>
                <Editor value={base64()} readOnly={true} loading={base64.loading} />
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
          </>,
        ]}
      />
    </Container>
  );
}
