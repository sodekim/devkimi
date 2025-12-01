import { ArrowLeftRight, Blend } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";
import {
    ClearButton,
    CopyButton,
    PasteButton,
    SaveButton,
    TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";
import { sm4_decrypt, sm4_encrypt, Sm4Mode } from "../../command/crypto/sm4";

const SM4_MODE_OPTIONS = [
    { value: "CBC", label: "CBC (Cipher Block Chaining)" },
    { value: "CFB", label: "CFB (Cipher Feed Back)" },
    { value: "CTR", label: "CTR (Counter)" },
    { value: "OFB", label: "OFB (Output Feed Back)" },
    { value: "ECB", label: "ECB (Electronic Code Book)" },
]

export default function Sm4() {
    const [encryption, setEncryption] = createSignal(true);
    const [mode, setMode] = createSignal<Sm4Mode>("CBC");
    const [iv, setIv] = createSignal("");
    const [secret, setSecret] = createSignal("");


    const [input, setInput] = createSignal("");
    const [output, setOutput] = createSignal("");

    // 切换模式时重置输入和输出
    createEffect(() => {
        const _ = encryption();
        setInput("");
        setOutput("");
    });

    createEffect(() => {
        if (input().length > 0) {
            if (encryption()) {
                sm4_encrypt(secret(), input(), mode(), iv())
                    .then(setOutput)
                    .catch((e) => setOutput(e.toString()))
            } else {
                sm4_decrypt(secret(), input(), mode(), iv())
                    .then(setOutput)
                    .catch((e) => setOutput(e.toString()))
            }
        } else {
            setOutput("");
        }
    });
    return (
        <div class="flex h-full flex-col gap-4">
            {/* 配置 */}
            <Config.Card>
                {/* 转换类型 */}
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

                {/* 加密模式 */}
                <Config.Option label="加密模式" icon={() => <Blend size={16} />}>
                    <Config.Select
                        value={mode()}
                        options={SM4_MODE_OPTIONS}
                        onChange={(value) => setMode(value as Sm4Mode)}
                        class="w-60"
                    />
                </Config.Option>
            </Config.Card>

            <Container >
                <div class="flex items-center justify-between">
                    <span class="text-sm">密钥</span>
                    <div class="flex items-center justify-center gap-2">
                        <PasteButton onRead={setSecret} />
                        <ClearButton onClick={() => setSecret("")} />
                    </div>
                </div>
                <input
                    class="input w-full rounded-md outline-none"
                    placeholder="输入密钥"
                    value={secret()}
                    onInput={(e) => setSecret(e.target.value)}
                />
            </Container>

            {/*输入*/}
            <Container class="h-0 flex-1">
                <div class="flex items-center justify-between">
                    <span class="text-sm">输入</span>
                    <div class="flex items-center justify-center gap-2">
                        <TextOperateButtons callback={setInput} />
                    </div>
                </div>
                <Editor
                    value={input()}
                    onChange={(value) => setInput(value)}
                    placeholder={encryption() ? "输入要加密的文本" : "输入要解密的文本"}
                />
            </Container>

            {/*输出*/}
            <Container class="h-0 flex-1">
                <div class="flex items-center justify-between">
                    <span class="flex items-center justify-center gap-4 text-sm">
                        输出
                    </span>
                    <div class="flex items-center justify-center gap-2">
                        <CopyButton value={output()} />
                        <SaveButton value={output()} />
                    </div>
                </div>
                <Editor value={output()} readOnly={true} />
            </Container>
        </div>
    );
}
