import { TextReadButtons, TextWriteButtons } from "@/component/Buttons";
import Card from "@/component/Card";
import Container from "@/component/Container";
import Editor from "@/component/Editor";
import Title from "@/component/Title";
import { createSignal } from "solid-js";

function toLines(text: string, pure: boolean = false) {
  if (pure) {
    return text.split(/\r?\n/);
  } else {
    return text.split(/(\r?\n)/).filter((s) => s !== "");
  }
}

function toWords(text: string, pure: boolean = false) {
  if (pure) {
    return text.split(/\s+/);
  } else {
    return text.split(/(\s+)/);
  }
}

// 删除字符串中的标点符号
function removePunctuation(text: string) {
  return text.replace(/[\p{P}\p{S}]/gu, "");
}

function toFirstUpperCase(line: string) {
  if (!line || line.length === 0) {
    return "";
  }
  if (line.length == 1) {
    return line.toUpperCase();
  }
  return line.charAt(0).toUpperCase() + line.slice(1);
}

function toFirstLowerCase(line: string) {
  if (!line || line.length === 0) {
    return "";
  }
  if (line.length == 1) {
    return line.toLowerCase();
  }
  return line.charAt(0).toLowerCase() + line.slice(1);
}

function concatWords(
  text: string,
  f1: (value: string) => string,
  f2: (value: string) => string,
  separator: string = "",
) {
  return toLines(text)
    .map((line) => {
      const words = toWords(line)
        .map((word) => word.trim())
        .filter((word) => word !== "" && word !== " ")
        .map((word) => removePunctuation(word));
      console.log(words);
      if (words.length === 0) {
        return "";
      } else if (words.length === 1) {
        return f1(words[0]);
      } else {
        return (
          f1(words[0]) +
          separator +
          words
            .slice(1)
            .map((word) => f2(word))
            .join(separator)
        );
      }
    })
    .join("");
}

export default function TextTools() {
  const [text, setText] = createSignal("");

  return (
    <Container>
      <Card>
        <Title value="转换换行符" />
        <div class="flex gap-2">
          <button
            class="btn btn-sm"
            onClick={() => setText(toLines(text(), true).join("\n"))}
          >
            LF (\n)
          </button>
          <button
            class="btn btn-sm"
            onClick={() => setText(toLines(text(), true).join("\r\n"))}
          >
            CRLF (\r\n)
          </button>
        </div>
      </Card>

      <Card>
        <Title value="转换大小写" />
        <div class="flex flex-wrap gap-2">
          <button
            class="btn btn-sm"
            onClick={() => setText(text().toLowerCase())}
          >
            全小写 (lower case)
          </button>

          <button
            class="btn btn-sm"
            onClick={() => setText(text().toUpperCase())}
          >
            全大写 (UPPER CASE)
          </button>

          <button
            class="btn btn-sm"
            onClick={() =>
              setText(
                toLines(text())
                  .map((line) => line.toLowerCase())
                  .map((line) => toFirstUpperCase(line))
                  .join(""),
              )
            }
          >
            句首大写 (Sentence case)
          </button>

          <button
            class="btn btn-sm"
            onClick={() => {
              setText(
                toWords(text())
                  .map((word) => word.toLowerCase())
                  .map((word) => toFirstUpperCase(word))
                  .join(""),
              );
            }}
          >
            首字母大写 (Title Case)
          </button>

          <button
            class="btn btn-sm"
            onClick={() =>
              setText(concatWords(text(), toFirstLowerCase, toFirstUpperCase))
            }
          >
            小驼峰 (camelCase)
          </button>

          <button
            class="btn btn-sm"
            onClick={() =>
              setText(concatWords(text(), toFirstUpperCase, toFirstUpperCase))
            }
          >
            大驼峰 (PascalCase)
          </button>
          <button
            class="btn btn-sm"
            onClick={() =>
              setText(
                concatWords(
                  text(),
                  (s) => s.toLowerCase(),
                  (s) => s.toLowerCase(),
                  "_",
                ),
              )
            }
          >
            蛇形 (snake_case)
          </button>

          <button
            class="btn btn-sm"
            onClick={() =>
              setText(
                concatWords(
                  text(),
                  (s) => s.toUpperCase(),
                  (s) => s.toUpperCase(),
                  "_",
                ),
              )
            }
          >
            常量大写 (CONSTANT_CASE)
          </button>

          <button class="btn btn-sm">短横线 (kebab-case)</button>
          <button class="btn btn-sm">COBOL (COBOL-CASE)</button>
          <button class="btn btn-sm">火车式 (Train-Case)</button>
          <button class="btn btn-sm">大小写交替 (aLtErNaTiNg cAsE)</button>
          <button class="btn btn-sm">反向大小写交替 (UbVeRse Case)</button>
          <button class="btn btn-sm">随机 (raNdoM cASe)</button>
        </div>
      </Card>

      <Card>
        <Title value="行排序" />
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-sm">按字母升序</button>
          <button class="btn btn-sm">按字母降序</button>
          <button class="btn btn-sm">按最后一个单词字母升序</button>
          <button class="btn btn-sm">按最后一个单词字母降序</button>
          <button class="btn btn-sm">反转</button>
          <button class="btn btn-sm">随机</button>
        </div>
      </Card>

      <div class="flex h-0 flex-1">
        <Card class="w-0 flex-1">
          <div class="flex items-center justify-between">
            <Title value="文本" />
            <TextWriteButtons callback={setText}>
              <TextReadButtons value={text()} />
            </TextWriteButtons>
          </div>
          <Editor value={text()} onChange={setText} />
        </Card>

        <Card class="flex w-80 flex-col">
          <Title value="统计数据" />
          <div class="size-full overflow-x-auto">
            <table class="table-pin-rows table-sm table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>数据</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2} class="text-lg font-bold">
                    文本
                  </td>
                </tr>
                <tr>
                  <td>字节</td>
                  <td></td>
                </tr>
                <tr>
                  <td>字符</td>
                  <td></td>
                </tr>
                <tr>
                  <td>单词</td>
                  <td></td>
                </tr>
                <tr>
                  <td>句子</td>
                  <td></td>
                </tr>
                <tr>
                  <td>段落</td>
                  <td></td>
                </tr>
                <tr>
                  <td>行</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={2} class="text-lg font-bold">
                    单词频率
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} class="text-lg font-bold">
                    字符频率
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Container>
  );
}
