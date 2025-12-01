import { ALargeSmall, ArrowLeftRight, Ruler } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import { generate_rsa_key_pair, encrypt_rsa, decrypt_rsa, type KeyFormat } from "../../command/crypto/rsa";
import {
    CopyButton,
    SaveButton,
    TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";

const KEY_FORMAT_OPTIONS = [
    { value: "Pkcs8", label: "PKCS#8" },
    { value: "Pkcs1", label: "PKCS#1" },
];

const BIT_SIZE_OPTIONS = [
    { value: "1024", label: "1024" },
    { value: "2048", label: "2048" },
    { value: "3072", label: "3072" },
    { value: "4096", label: "4096" },
];

export default function Rsa() {
    const [encryption, setEncryption] = createSignal(true);
    const [keyFormat, setKeyFormat] = createSignal<KeyFormat>("Pkcs8");
    const [bitSize, setBitSize] = createSignal(1024);
    const [privateKey, setPrivateKey] = createSignal("");
    const [publicKey, setPublicKey] = createSignal("");
    const [input, setInput] = createSignal("");
    const [output, setOutput] = createSignal("");
    createEffect(() => {
        generate_rsa_key_pair(keyFormat(), bitSize()).then(([private_key, public_key]) => {
            setPrivateKey(private_key);
            setPublicKey(public_key);
        });
    });

    createEffect(() => {
        if (input().length > 0) {
            if (encryption()) {
                encrypt_rsa(keyFormat(), publicKey(), input()).then(setOutput).catch((e) => setOutput(e.toString()));
            } else {
                decrypt_rsa(keyFormat(), privateKey(), input()).then(setOutput).catch((e) => setOutput(e.toString()));
            }
        } else {
            setOutput("");
        }

    });

    return (
        <div class="flex h-full flex-col gap-4">
            {/* 配置 */}
            <Config.Card>
                <Config.Option
                    label="转换"
                    description="选择转换的类型"
                    icon={() => <ArrowLeftRight size={16} />}
                >
                    <Config.Switch
                        value={encryption()}
                        onChange={setEncryption}
                        on="加密"
                        off="解密"
                    />
                </Config.Option>

                {/*密钥格式*/}
                <Config.Option label="密钥格式" icon={() => <ALargeSmall size={16} />}>
                    <Config.Select
                        value={keyFormat()}
                        options={KEY_FORMAT_OPTIONS}
                        onChange={setKeyFormat}
                        class="w-30"
                    />
                </Config.Option>

                {/* 密钥长度 */}
                <Config.Option label="密钥长度" icon={() => <Ruler size={16} />}>
                    <Config.Select
                        value={`${bitSize()}`}
                        options={BIT_SIZE_OPTIONS}
                        onChange={(value) => setBitSize(parseInt(value))}
                        class="w-30"
                    />
                </Config.Option>
            </Config.Card>

            {/* 密钥对 */}
            <div class="h-0 max-h-100 flex-1 flex gap-4">
                {/*私钥*/}
                <Container class="h-full flex-1 w-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm">私钥</span>
                        <div class="flex items-center justify-center gap-2">
                            <TextOperateButtons callback={setPrivateKey} />
                            <CopyButton value={privateKey()} />
                        </div>
                    </div>
                    <Editor
                        value={privateKey()}
                        onChange={setPrivateKey}
                        placeholder="RSA 私钥"
                    />
                </Container>

                {/*公钥*/}
                <Container class="h-full flex-1 w-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm">公钥</span>
                        <div class="flex items-center justify-center gap-2">
                            <TextOperateButtons callback={setPublicKey} />
                            <CopyButton value={publicKey()} />
                        </div>
                    </div>
                    <Editor value={publicKey()} onChange={setPublicKey} placeholder="RSA 公钥" />
                </Container>
            </div>

            {/* 输入与输出 */}
            <div class="flex-1 flex gap-4 h-0">
                {/* 输入 */}
                <Container class="h-full flex-1 w-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm">输入</span>
                        <div class="flex items-center justify-center gap-2">
                            <TextOperateButtons callback={setInput} />
                        </div>
                    </div>
                    <Editor
                        value={input()}
                        onChange={setInput}
                        placeholder={encryption() ? "输入需要加密的数据" : "输入需要解密的数据"}
                    />
                </Container>

                {/* 输出 */}
                <Container class="h-full flex-1 w-0">
                    <div class="flex items-center justify-between">
                        <span class="text-sm">输出</span>
                        <div class="flex items-center justify-center gap-2">
                            <CopyButton value={output()} />
                            <SaveButton value={output()} />
                        </div>
                    </div>
                    <Editor value={output()} readOnly={true} />
                </Container>
            </div>

        </div>

    );
}
