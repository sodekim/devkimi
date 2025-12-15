import {
  Algorithm,
  decodeJwt,
  encodeJwt,
  generateJwtEcdsaKeyPair,
  generateJwtRsaKeyPair,
  Header,
} from "@/command/codec/jwt";
import { createEncodingText, Encoding } from "@/command/crypto/type";
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
import Title from "@/component/Title";
import {
  ArrowLeftRight,
  Blend,
  CircleCheckBig,
  CircleX,
  Ruler,
  SquareLibrary,
} from "lucide-solid";
import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import { twMerge } from "tailwind-merge";

const ALGORITHM_OPTIONS = [
  { value: "HS256", label: "HS256" },
  { value: "HS384", label: "HS384" },
  { value: "HS512", label: "HS512" },
  { value: "RS256", label: "RS256" },
  { value: "RS384", label: "RS384" },
  { value: "RS512", label: "RS512" },
  { value: "ES256", label: "ES256" },
  { value: "ES384", label: "ES384" },
  { value: "ES512", label: "ES512" },
];

const RSA_BIT_SIZE_OPTIONS = [
  { value: 2048, label: "2048" },
  { value: 3072, label: "3072" },
  { value: 4096, label: "4096" },
];

const defaultHeader: Header = { alg: Algorithm.HS256, typ: "JWT" };

export default function Jwt() {
  const [algorithm, setAlgorithm] = createSignal<Algorithm>(Algorithm.HS256);
  const [encode, _setEncode] = createSignal(true);
  const [header, setHeader] = createSignal<Header>(defaultHeader);
  const [payload, setPayload] = createSignal("{}");
  const [secret, setSecret] = createEncodingText();
  const [privateKey, setPrivateKey] = createSignal("");
  const [publicKey, setPublicKey] = createSignal("");
  const [token, setToken] = createSignal("");
  const [verified, setVerified] = createSignal<boolean | null>(null);
  const prettyHeader = createMemo(() => JSON.stringify(header(), null, 2));
  const [rsaBitSize, setRsaBitSize] = createSignal(2048);
  const useKeyPair = createMemo(
    () =>
      ![Algorithm.HS256, Algorithm.HS384, Algorithm.HS512].includes(
        algorithm(),
      ),
  );
  const isRsaKeyPair = createMemo(() =>
    [Algorithm.RS256, Algorithm.RS384, Algorithm.RS512].includes(algorithm()),
  );

  // 密钥
  const key = createMemo(() => {
    switch (algorithm()) {
      case Algorithm.HS256:
      case Algorithm.HS384:
      case Algorithm.HS512:
        return secret;
      case Algorithm.RS256:
      case Algorithm.RS384:
      case Algorithm.RS512:
      case Algorithm.ES256:
      case Algorithm.ES384:
      case Algorithm.ES512:
        return {
          encoding: Encoding.Utf8,
          text: encode() ? privateKey() : publicKey(),
        };
    }
  });

  const setEncode = (value: boolean) => {
    batch(() => {
      setHeader({ alg: Algorithm.HS256, typ: "JWT" });
      setPayload("{}");
      setToken("");
      setVerified(null);
      setPrivateKey("");
      setPublicKey("");
      setSecret({ text: "", encoding: Encoding.Utf8 });
      setAlgorithm(Algorithm.HS256);
      setRsaBitSize(2048);
      _setEncode(value);
    });
  };

  // 更新算法
  createEffect(() => {
    setHeader((prev) => ({ ...prev, alg: algorithm() }));
    // 算法变动时清空密钥
    setPrivateKey("");
    setPublicKey("");
    setSecret({ text: "", encoding: Encoding.Utf8 });
  });

  // 处理数据
  createEffect(() => {
    if (encode()) {
      if ((header() || payload()) && key().text) {
        encodeJwt(header(), payload(), key())
          .then(setToken)
          .catch((e) => setToken(e.toString()));
      } else {
        setToken("");
      }
    } else {
      if (token()) {
        decodeJwt(token(), key())
          .then(([header, payload, verified]) => {
            setHeader(header);
            setPayload(payload);
            setVerified(verified);
            setAlgorithm(header.alg);
          })
          .catch((e) => {
            setVerified(null);
            setPayload(e.toString());
          });
      } else {
        setHeader(defaultHeader);
        setPayload("{}");
      }
    }
  });

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
            value={encode()}
            onChange={setEncode}
            on="编码"
            off="解码"
          />
        </Config.Option>

        <Show when={encode()}>
          <Config.Option
            label="签名算法"
            description="选择使用的签名算法"
            icon={() => <Blend size={16} />}
          >
            <Config.Select
              value={algorithm()}
              options={ALGORITHM_OPTIONS}
              onChange={(value) => setAlgorithm(value as Algorithm)}
              class="w-40"
            />
          </Config.Option>
        </Show>

        {/* RSA密钥长度 */}
        <Show when={encode() && isRsaKeyPair()}>
          <Config.Option
            label="密钥长度"
            icon={() => <Ruler size={16} />}
            description="选择密钥的长度，单位为位，一个字节为8位。"
          >
            <Config.Select
              value={rsaBitSize()}
              options={RSA_BIT_SIZE_OPTIONS}
              onChange={(value) => setRsaBitSize(value)}
              class="w-30"
            />
          </Config.Option>
        </Show>
      </Config.Card>

      <div
        class={twMerge(
          "flex h-0 flex-1 gap-4",
          encode() ? "order-2" : "order-4",
        )}
      >
        {/*头部*/}
        <Card class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title>头部</Title>
            <Show
              when={!encode()}
              fallback={<CopyButton value={prettyHeader()} />}
            >
              <TextReadButtons value={prettyHeader()} />
            </Show>
          </div>
          <Editor
            value={prettyHeader()}
            placeholder="JWT 头部"
            language="json"
            readOnly={true}
          />
        </Card>

        {/*载荷*/}
        <Card class="h-full w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title>载荷</Title>
            <Show
              when={encode()}
              fallback={<TextReadButtons value={payload()} />}
            >
              <TextWriteButtons callback={(value) => setPayload(value || "{}")}>
                <button
                  class="btn btn-sm"
                  onClick={() => formatJson(payload()).then(setPayload)}
                >
                  <SquareLibrary size={16} />
                  格式化
                </button>
              </TextWriteButtons>
            </Show>
          </div>
          <Editor
            value={payload()}
            onChange={setPayload}
            placeholder="输入 JWT 载荷"
            language="json"
            readOnly={!encode()}
          />
        </Card>
      </div>

      <Switch>
        <Match when={useKeyPair()}>
          {/* 密钥对 */}
          <div class="order-3 flex h-0 flex-1 gap-4">
            {/*私钥*/}
            <Card class="h-full w-0 flex-1">
              <div class="flex items-center justify-between">
                <Title>私钥</Title>
                <TextWriteButtons callback={setPrivateKey} position="before">
                  <GenerateButton
                    onGenerate={() => {
                      switch (algorithm()) {
                        case Algorithm.RS256:
                        case Algorithm.RS384:
                        case Algorithm.RS512:
                          generateJwtRsaKeyPair(rsaBitSize()).then(
                            ([privateKey, publicKey]) => {
                              setPublicKey(publicKey);
                              setPrivateKey(privateKey);
                            },
                          );
                          break;
                        case Algorithm.ES256:
                        case Algorithm.ES384:
                        case Algorithm.ES512:
                          generateJwtEcdsaKeyPair(algorithm()).then(
                            ([privateKey, publicKey]) => {
                              setPublicKey(publicKey);
                              setPrivateKey(privateKey);
                            },
                          );
                          break;
                      }
                    }}
                    label="生成密钥对"
                  />
                  <CopyButton value={privateKey()} />
                </TextWriteButtons>
              </div>
              <Editor
                value={privateKey()}
                onChange={setPrivateKey}
                placeholder="输入密钥"
              />
            </Card>

            {/*公钥*/}
            <Card class="h-full w-0 flex-1">
              <div class="flex items-center justify-between">
                <Title>公钥</Title>
                <TextWriteButtons callback={setPublicKey} position="before">
                  <CopyButton value={publicKey()} />
                </TextWriteButtons>
              </div>
              <Editor
                value={publicKey()}
                onChange={setPublicKey}
                placeholder="输入公钥"
              />
            </Card>
          </div>
        </Match>

        <Match when={!useKeyPair()}>
          <Card class="order-3">
            <div class="flex items-center justify-between">
              <Title>签名密钥</Title>
              <TextWriteButtons callback={setPayload} />
            </div>
            <EncodingTextInput
              value={secret}
              setValue={setSecret}
              placeholder={encode() ? "输入密钥生成令牌" : "输入密钥校验令牌"}
            />
          </Card>
        </Match>
      </Switch>

      {/* 令牌 */}
      <Card class={twMerge("h-60", encode() ? "order-4" : "order-2")}>
        <div class="flex items-center justify-between">
          <div class="join gap-4">
            <Title>令牌</Title>
            <Show when={verified() !== null}>
              <Switch>
                <Match when={verified()}>
                  <span class="flex items-center justify-center gap-1 text-sm">
                    <CircleCheckBig size={16} color="var(--color-success)" />
                    校验成功
                  </span>
                </Match>
                <Match when={!verified()}>
                  <span class="flex items-center justify-center gap-1 text-sm">
                    <CircleX size={16} color="var(--color-error)" />
                    校验失败
                  </span>
                </Match>
              </Switch>
            </Show>
          </div>

          <Show
            when={encode()}
            fallback={<TextWriteButtons callback={setToken} />}
          >
            <TextReadButtons value={token()} />
          </Show>
        </div>
        <Editor value={token()} readOnly={encode()} onChange={setToken} />
      </Card>
    </Container>
  );
}
