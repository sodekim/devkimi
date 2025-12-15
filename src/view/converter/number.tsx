import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import { PaintRoller } from "lucide-solid";
import { createSignal } from "solid-js";

type Radix = 2 | 8 | 10 | 16;

/**
 * 格式化数字字符串，支持自定义分隔
 * @param value - 数字字符串
 * @param chunkSize - 每组位数，默认根据进制自动选择
 * @param separator - 分隔符，默认逗号
 * @returns 格式化后的字符串
 */
function formatNumber(
  value: string,
  chunkSize?: number,
  separator: string = ",",
): string {
  if (!value || value.trim() === "") return "";

  const trimmed = value.trim();
  const size = chunkSize || 3;

  // 从右往左分组
  const reversed = trimmed.split("").reverse().join("");
  const chunks: string[] = [];

  for (let i = 0; i < reversed.length; i += size) {
    chunks.push(reversed.slice(i, i + size));
  }

  return chunks
    .map((chunk) => chunk.split("").reverse().join(""))
    .reverse()
    .join(separator);
}

/**
 * 将数字字符串解析为数字
 *
 * @param value - 数字字符串
 * @param base - 进制
 * @returns
 */
function parseNumber(value: string, radix: Radix) {
  if (!value || value.trim() === "") {
    return undefined;
  }
  switch (radix) {
    case 2:
      return BigInt("0b" + value.replace(/[^0-1]/g, ""));
    case 8:
      return BigInt("0o" + value.replace(/[^0-7]/g, ""));
    case 10:
      return BigInt(value.replace(/[^0-9]/g, ""));
    case 16:
      return BigInt("0x" + value.replace(/[^0-9a-fA-F]/g, ""));
  }
}

export default function NumberConverter() {
  const [format, setFormat] = createSignal(true);
  const [value, setValue] = createSignal<BigInt>();
  // 版本号，用于触发重新计算 十六进制时替换非法数字导致数字没有变化时会触发重新计算
  const [version, setVersion] = createSignal(0);
  const hex = () => {
    const _ = version();
    const _value = value()?.toString(16)?.toUpperCase() ?? "";
    return format() ? formatNumber(_value, 4, " ") : _value;
  };
  const decimal = () => {
    const _ = version();
    const _value = value()?.toString(10) ?? "";
    return format() ? formatNumber(_value, 3, ",") : _value;
  };
  const octal = () => {
    const _ = version();
    const _value = value()?.toString(8) ?? "";
    return format() ? formatNumber(_value, 3, " ") : _value;
  };
  const binary = () => {
    const _ = version();
    const _value = value()?.toString(2) ?? "";
    return format() ? formatNumber(_value, 4, " ") : _value;
  };

  const update = (value: string, radix: Radix) => {
    setValue(parseNumber(value, radix));
    setVersion(version() + 1);
  };

  return (
    <Container>
      <Config.Card>
        <Config.Option
          label="格式化数字"
          icon={() => <PaintRoller size={16} />}
        >
          <Config.Switch value={format()} onChange={setFormat} />
        </Config.Option>
      </Config.Card>

      <Card
        title="十六进制"
        operation={
          <TextWriteButtons callback={(value) => update(value, 16)}>
            <TextReadButtons value={hex()} />
          </TextWriteButtons>
        }
      >
        <input
          class="input input-md w-full font-mono text-lg font-bold outline-none"
          value={hex()}
          onInput={(e) => update(e.target.value, 16)}
        />
      </Card>

      <Card
        title="十进制"
        operation={
          <TextWriteButtons callback={(value) => update(value, 10)}>
            <TextReadButtons value={decimal()} />
          </TextWriteButtons>
        }
      >
        <input
          class="input input-md w-full font-mono text-lg font-bold outline-none"
          value={decimal()}
          onInput={(e) => update(e.target.value, 10)}
        />
      </Card>

      <Card
        title="八进制"
        operation={
          <TextWriteButtons callback={(value) => update(value, 8)}>
            <TextReadButtons value={octal()} />
          </TextWriteButtons>
        }
      >
        <input
          class="input input-md w-full font-mono text-lg font-bold outline-none"
          value={octal()}
          onInput={(e) => update(e.target.value, 8)}
        />
      </Card>

      <Card
        title="二进制"
        operation={
          <TextWriteButtons callback={(value) => update(value, 2)}>
            <TextReadButtons value={binary()} />
          </TextWriteButtons>
        }
      >
        <input
          class="input input-md w-full font-mono text-lg font-bold outline-none"
          value={binary()}
          onInput={(e) => update(e.target.value, 2)}
        />
      </Card>
    </Container>
  );
}
