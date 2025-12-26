import {
  Algorithm,
  decodeJwt,
  encodeJwt,
  generateJwtEcdsaKeyPair,
  generateJwtRsaKeyPair,
  Header,
} from "@/command/codec/jwt";
import { Encoding, EncodingText, RsaBitSize } from "@/command/crypto/type";
import { formatJson } from "@/command/formatter/json";
import {
  CopyButton,
  GenerateButton,
  TextReadButtons,
  TextWriteButtons,
} from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import { EncodingTextInput } from "@/component/Encoding";
import Main from "@/component/Main";
import { createCachableStore } from "@/lib/cache";
import { stringify } from "@/lib/util";
import {
  ArrowLeftRight,
  Blend,
  CircleCheckBig,
  CircleX,
  Ruler,
  SquareLibrary,
} from "lucide-solid";
import { createMemo, createResource, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";
import { RSA_BIT_SIZE_OPTIONS } from "../crypto/options";

type KeyPair = {
  private: string;
  public: string;
  size: RsaBitSize;
};

export default function Jwt() {
  const [store, setStore] = createCachableStore({
    encode: true,
    header: { alg: Algorithm.HS256, typ: "JWT" } as Header,
    payload: "{}",
    secret: { text: "", encoding: Encoding.Utf8 } as EncodingText,
    keyPair: { private: "", public: "", size: RsaBitSize.Bits2048 } as KeyPair,
    token: "",
    verified: null as boolean | null,
  });

  // 切换编码模式
  const setEncode = (value: boolean) => {
    setStore({
      encode: value,
      header: { alg: Algorithm.HS256, typ: "JWT" } as Header,
      payload: "{}",
      secret: { text: "", encoding: Encoding.Utf8 } as EncodingText,
      keyPair: {
        private: "",
        public: "",
        size: RsaBitSize.Bits2048,
      } as KeyPair,
      token: "",
      verified: null,
    });
  };

  // 判断是否使用密钥对
  const isKeyPair = () =>
    ![Algorithm.HS256, Algorithm.HS384, Algorithm.HS512].includes(
      store.header.alg,
    );

  // 判断是否使用RSA密钥对
  const isRsaKeyPair = () =>
    [Algorithm.RS256, Algorithm.RS384, Algorithm.RS512].includes(
      store.header.alg,
    );

  // 生成密钥对
  const generateKeyPair = () => {
    if (isRsaKeyPair()) {
      generateJwtRsaKeyPair(store.keyPair.size).then(setKeyPair);
    } else {
      generateJwtEcdsaKeyPair(store.header.alg).then(setKeyPair);
    }
  };

  // 设置密钥对
  const setKeyPair = ([k1, k2]: [string, string]) => {
    setStore("keyPair", (prev) => ({
      ...prev,
      private: k1,
      public: k2,
    }));
  };

  // 获取实际需要使用的密钥
  const secret = createMemo(() => {
    if (isKeyPair()) {
      return {
        text: store.encode ? store.keyPair.private : store.keyPair.public,
        encoding: Encoding.Utf8,
      };
    } else {
      return store.secret;
    }
  });

  // 获取格式化后的JWT头
  const getPrettryHeader = createMemo(() =>
    JSON.stringify(store.header, null, 2),
  );

  // 设置格式化后JWT负载
  const setPrettyPayload = () => {
    formatJson(store.payload).then((value) => setStore("payload", value));
  };

  // 编码结果
  const [encoded] = createResource(
    () =>
      store.encode
        ? {
            header: store.header,
            payload: store.payload,
            secret: secret(),
          }
        : false,
    ({ header, payload, secret }) => {
      if (payload && secret.text) {
        return encodeJwt(header, payload, secret).catch(stringify);
      }
    },
  );

  // 解码结果
  const [decoded] = createResource(
    () => (store.encode ? false : { token: store.token, secret: secret() }),
    ({ token, secret }) => {
      if (token) {
        decodeJwt(token, secret)
          .then(([header, payload, verified]) => {
            setStore((prev) => ({ ...prev, header, payload, verified }));
          })
          .catch((e) => {
            setStore((prev) => ({ ...prev, payload: stringify(e) }));
          });
      } else {
        setStore((prev) => ({
          ...prev,
          header: { alg: Algorithm.HS256, typ: "JWT" } as Header,
          payload: "{}",
          verified: null,
        }));
      }
    },
  );

  return (
    <Container>
      {/* 配置 */}
      <Config.Card>
        {/* 操作配置 */}
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

        <Show when={store.encode}>
          <Config.Option
            label="签名算法"
            description="选择使用的签名算法"
            icon={() => <Blend size={16} />}
          >
            <Config.Select
              value={store.header.alg}
              options={Object.keys(Algorithm)}
              onChange={(value) => setStore("header", "alg", value)}
              class="w-40"
            />
          </Config.Option>
        </Show>

        {/* RSA密钥长度 */}
        <Show when={store.encode && isRsaKeyPair()}>
          <Config.Option
            label="密钥长度"
            icon={() => <Ruler size={16} />}
            description="选择密钥的长度，单位为位，一个字节为8位。"
          >
            <Config.Select
              value={store.keyPair.size}
              options={RSA_BIT_SIZE_OPTIONS}
              onChange={(value) => {
                setStore("keyPair", {
                  size: value,
                  public: "",
                  private: "",
                });
              }}
              class="w-30"
            />
          </Config.Option>
        </Show>
      </Config.Card>

      <Main class={store.encode ? "order-2" : "order-4"}>
        {/*头部*/}
        <Card
          class="h-full w-0 flex-1"
          loading={decoded.loading}
          title="头部"
          operation={
            <Switch>
              <Match when={store.encode}>
                <CopyButton value={getPrettryHeader()} />
              </Match>
              <Match when={!store.encode}>
                <TextReadButtons value={getPrettryHeader()} />
              </Match>
            </Switch>
          }
        >
          <Editor
            value={getPrettryHeader()}
            placeholder="JWT 头部"
            language="json"
            readOnly={true}
          />
        </Card>

        {/*载荷*/}
        <Card
          class="h-full w-0 flex-1"
          loading={decoded.loading}
          title="载荷"
          operation={
            <Switch>
              <Match when={store.encode}>
                <TextWriteButtons
                  callback={(value) => setStore("payload", value || "{}")}
                >
                  <button class="btn btn-sm" onClick={setPrettyPayload}>
                    <SquareLibrary size={16} />
                    格式化
                  </button>
                </TextWriteButtons>
              </Match>
              <Match when={!store.encode}>
                <TextReadButtons value={store.payload} />
              </Match>
            </Switch>
          }
        >
          <Editor
            value={store.payload}
            onChange={(value) => setStore("payload", value)}
            placeholder="输入 JWT 载荷"
            language="json"
            readOnly={!store.encode}
          />
        </Card>
      </Main>

      <Switch>
        <Match when={isKeyPair()}>
          {/* 密钥对 */}
          <Main class="order-3">
            {/*私钥*/}
            <Card
              class="h-full w-0 flex-1"
              title="私钥"
              operation={
                <TextWriteButtons
                  callback={(value) => setStore("keyPair", "private", value)}
                  position="before"
                >
                  <Show when={store.encode}>
                    <GenerateButton
                      onGenerate={generateKeyPair}
                      label="生成密钥对"
                    />
                    <CopyButton value={store.keyPair.private} />
                  </Show>
                </TextWriteButtons>
              }
            >
              <Editor
                value={store.keyPair.private}
                onChange={(value) => setStore("keyPair", "private", value)}
                placeholder="输入密钥"
              />
            </Card>

            {/*公钥*/}
            <Card
              class="h-full w-0 flex-1"
              title="公钥"
              operation={
                <TextWriteButtons
                  callback={(value) => setStore("keyPair", "public", value)}
                  position="before"
                >
                  <CopyButton value={store.keyPair.public} />
                </TextWriteButtons>
              }
            >
              <Editor
                value={store.keyPair.public}
                onChange={(value) => setStore("keyPair", "public", value)}
                placeholder="输入公钥"
              />
            </Card>
          </Main>
        </Match>

        <Match when={!isKeyPair()}>
          <Card
            class="order-3"
            title="签名密钥"
            operation={
              <TextWriteButtons
                callback={(value) => setStore("secret", "text", value)}
              />
            }
          >
            <EncodingTextInput
              value={store.secret}
              onEncodingChange={(value) =>
                setStore("secret", "encoding", value)
              }
              onTextChange={(value) => setStore("secret", "text", value)}
              placeholder={
                store.encode ? "输入密钥生成令牌" : "输入密钥校验令牌"
              }
            />
          </Card>
        </Match>
      </Switch>

      {/* 令牌 */}
      <Card
        class={twMerge("h-60", store.encode ? "order-4" : "order-2")}
        title="令牌"
        loading={encoded.loading}
        operation={
          <Switch>
            <Match when={store.encode}>
              <TextReadButtons value={encoded()} />
            </Match>
            <Match when={!store.encode}>
              <TextWriteButtons
                callback={(value) => setStore("token", value)}
              />
            </Match>
          </Switch>
        }
        notification={
          <Show when={store.verified !== null}>
            <Switch>
              <Match when={store.verified}>
                <span class="flex items-center justify-center gap-1 text-sm">
                  <CircleCheckBig size={16} color="var(--color-success)" />
                  校验成功
                </span>
              </Match>
              <Match when={!store.verified}>
                <span class="flex items-center justify-center gap-1 text-sm">
                  <CircleX size={16} color="var(--color-error)" />
                  校验失败
                </span>
              </Match>
            </Switch>
          </Show>
        }
      >
        <Switch>
          <Match when={store.encode}>
            <Editor value={encoded()} readOnly={true} />
          </Match>
          <Match when={!store.encode}>
            <Editor
              value={store.token}
              onChange={(value) => setStore("token", value)}
            />
          </Match>
        </Switch>
      </Card>
    </Container>
  );
}
