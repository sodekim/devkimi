import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Config from "@/component/Config";
import Container from "@/component/Container";
import { createPageStore } from "@/lib/persisted";
import { PaintRoller } from "lucide-solid";

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
    return BigInt(0);
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
  const [store, setStore] = createPageStore({
    format: true,
    value: "0",
    version: 0,
  });

  const hex = () => {
    const _ = store.version;
    const value = BigInt(store.value).toString(16);
    return store.format ? formatNumber(value, 4, " ") : value;
  };
  const decimal = () => {
    const _ = store.version;
    const value = BigInt(store.value).toString(10);
    return store.format ? formatNumber(value, 3, ",") : value;
  };
  const octal = () => {
    const _ = store.version;
    const value = BigInt(store.value).toString(8);
    return store.format ? formatNumber(value, 3, " ") : value;
  };
  const binary = () => {
    const _ = store.version;
    const value = BigInt(store.value).toString(2);
    return store.format ? formatNumber(value, 4, " ") : value;
  };

  const update = (value: string, radix: Radix) => {
    setStore((prev) => ({
      ...prev,
      value: parseNumber(value, radix).toString(),
      version: prev.version + 1,
    }));
  };

  return (
    <Container>
      <Config.Card>
        <Config.Option
          label="格式化数字"
          icon={() => <PaintRoller size={16} />}
        >
          <Config.Switch
            value={store.format}
            onChange={(value) =>
              setStore((prev) => ({ ...prev, format: value }))
            }
          />
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
