import { ArrowLeftFromLine, CaseSensitive, SquareAsterisk } from "lucide-solid";
import { createEffect, createSignal, For } from "solid-js";
import { Capture, parseRegex } from "../../command/text/regex";
import {
  ClearButton,
  PasteButton,
  TextOperateButtons,
} from "../../component/Buttons";
import Config from "../../component/Config";
import Container from "../../component/Container";
import Editor from "../../component/Editor";

const RegexGrammars: Array<{ grammar: string; description: string }> = [
  // 🔹 基础字符匹配
  { grammar: ".", description: "除换行符外的任意一个字符" },
  { grammar: "\\w", description: "单词字符（字母、数字、下划线）" },
  { grammar: "\\W", description: "非单词字符" },
  { grammar: "\\d", description: "数字字符（0-9）" },
  { grammar: "\\D", description: "非数字字符" },
  { grammar: "\\s", description: "空白字符（空格、制表符、换行等）" },
  { grammar: "\\S", description: "非空白字符" },

  // 🔹 锚点与边界
  { grammar: "^", description: "字符串开始位置（多行模式每行开头）" },
  { grammar: "$", description: "字符串结束位置（多行模式每行结尾）" },
  { grammar: "\\b", description: "单词边界" },
  { grammar: "\\B", description: "非单词边界" },

  // 🔹 量词（重复次数）
  { grammar: "x*", description: "匹配 0 次或多次 x" },
  { grammar: "x+", description: "匹配 1 次或多次 x" },
  { grammar: "x?", description: "匹配 0 次或 1 次 x" },
  { grammar: "x{n}", description: "精确匹配 n 次 x" },
  { grammar: "x{n,}", description: "至少匹配 n 次 x" },
  { grammar: "x{n,m}", description: "匹配 n 到 m 次 x" },

  // 🔹 分组与捕获
  { grammar: "(x)", description: "捕获分组，结果可被引用（如 \\1）" },
  { grammar: "(?:x)", description: "非捕获分组，仅分组不捕获" },
  { grammar: "x(?=y)", description: "正向先行断言：x 后面是 y 才匹配 x" },
  { grammar: "x(?!y)", description: "负向先行断言：x 后面不是 y 才匹配 x" },
  { grammar: "(?<=y)x", description: "正向后行断言：x 前面是 y 才匹配 x" },
  { grammar: "(?<!y)x", description: "负向后行断言：x 前面不是 y 才匹配 x" },

  // 🔹 字符集合
  { grammar: "[abc]", description: "匹配括号中任意一个字符（a 或 b 或 c）" },
  { grammar: "[^abc]", description: "匹配不在括号中的任意字符" },
  { grammar: "[a-z]", description: "匹配 a 到 z 的任意一个小写字母" },
  { grammar: "[^a-z]", description: "匹配不在 a 到 z 范围内的任意字符" },
  { grammar: "[A-Za-z]", description: "匹配任意大小写字母" },
  { grammar: "[0-9A-F]", description: "匹配十六进制数字" },
];

export default function RegexTest() {
  const [global, setGlobal] = createSignal(true);
  const [caseInsensitive, setCaseInsensitive] = createSignal(false);
  const [multiLine, setMultiLine] = createSignal(false);
  const [pattern, setPattern] = createSignal("");
  const [text, setText] = createSignal("");
  const [captures, setCaptures] = createSignal<Capture[]>([]);

  createEffect(() => {
    if (pattern().length > 0 && text().length > 0) {
      parseRegex(text(), pattern(), global(), multiLine(), caseInsensitive())
        .then(setCaptures)
        .catch((e) => console.error("parse regex error!", e));
    } else {
      setCaptures([]);
    }
  });
  return (
    <div class="flex h-full flex-col gap-4">
      {/* 配置 */}
      <Config.Card>
        {/* 全部匹配配置 */}
        <Config.Option
          label="全部匹配"
          description="查找文本中所有的匹配项，或在匹配一次后停止。"
          icon={() => <SquareAsterisk size={16} />}
        >
          <Config.Switch value={global()} onChange={setGlobal} />
        </Config.Option>

        {/* 忽略大小写配置 */}
        <Config.Option
          label="忽略大小写"
          description="指定不区分大小的匹配"
          icon={() => <CaseSensitive size={16} />}
        >
          <Config.Switch
            value={caseInsensitive()}
            onChange={setCaseInsensitive}
          />
        </Config.Option>

        {/* 多行模式配置 */}
        <Config.Option
          label="多行模式"
          description="查找的模式从单行变为多行"
          icon={() => <ArrowLeftFromLine size={16} />}
        >
          <Config.Switch value={multiLine()} onChange={setMultiLine} />
        </Config.Option>
      </Config.Card>

      {/*正则表达式*/}
      <Container class="h-30">
        <div class="flex items-center justify-between">
          <span class="text-sm">正则表达式</span>
          <div class="flex items-center justify-center gap-2">
            <PasteButton onRead={setPattern} />
            <ClearButton onClick={() => setPattern("")} />
          </div>
        </div>
        <input
          class="input w-full rounded-md outline-none"
          placeholder="输入正则表达式"
          value={pattern()}
          onInput={(e) => setPattern(e.target.value)}
        />
      </Container>

      {/*文本*/}
      <Container class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">文本</span>
          <div class="flex items-center justify-center gap-2">
            <TextOperateButtons callback={setText} />
          </div>
        </div>
        <Editor
          value={text()}
          onChange={setText}
          placeholder="输入要匹配的文本"
        />
      </Container>

      <div class="flex h-0 flex-1 items-center justify-center gap-4">
        {/*匹配信息*/}
        <Container class="h-full flex-1 overflow-x-hidden">
          <div class="flex items-center justify-between">
            <span class="text-sm">匹配信息</span>
          </div>
          <div class="size-full overflow-x-auto">
            <table class="table-pin-rows table-sm table">
              {/* head */}
              <thead>
                <tr>
                  <th class="min-w-20">名称</th>
                  <th class="min-w-20">位置</th>
                  <th>值</th>
                </tr>
              </thead>
              <tbody>
                <For each={captures()}>
                  {(capture, i) =>
                    capture.map((match, j) => (
                      <tr class="hover:bg-base-300">
                        {j === 0 ? (
                          <td>{`匹配 ${i() + 1}`}</td>
                        ) : (
                          <td class="pl-8">{`分组 ${j}`}</td>
                        )}
                        <td>{`${match.start}-${match.end}`}</td>
                        <td>{`${match.value}`}</td>
                      </tr>
                    ))
                  }
                </For>
              </tbody>
            </table>
          </div>
        </Container>

        {/*速查表*/}
        <Container class="h-full flex-1 overflow-x-hidden">
          <div class="flex items-center justify-between">
            <span class="text-sm">速查表</span>
          </div>
          <div class="size-full overflow-x-auto">
            <table class="table-pin-rows table-sm table">
              <thead>
                <tr>
                  <th>描述</th>
                  <th>语法</th>
                </tr>
              </thead>
              <tbody>
                {RegexGrammars.map(({ grammar, description }) => (
                  <tr class="hover:bg-base-300">
                    <td>{description}</td>
                    <td>{grammar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>
    </div>
  );
}
