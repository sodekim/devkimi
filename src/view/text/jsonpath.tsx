import { createEffect, createSignal } from "solid-js";
import { parseJsonPath } from "@/command/text/jsonpath";
import {
  ClearButton,
  PasteButton,
  TextOperateButtons,
} from "@/component/Buttons";
import Container from "@/component/Container";
import Card from "@/component/Card";
import Editor from "@/component/Editor";

const JsonPathGrammars: Array<{ expression: string; description: string }> = [
  {
    expression: "$",
    description: "根对象或数组",
  },
  {
    expression: "$.name",
    description: "通过点号表示法访问属性",
  },
  {
    expression: "$['name']",
    description: "通过括号表示法访问属性",
  },
  {
    expression: "$.*",
    description: "获取根对象中的所有属性",
  },
  {
    expression: "$.name1,name2",
    description: "获取多个指定的属性",
  },
  {
    expression: "$.[name1,name2]",
    description: "通过括号表示法获取多个指定的属性",
  },
  {
    expression: "$.(name1,name2)",
    description: "通过函数式表示法获取多个指定的属性",
  },
  {
    expression: "$.[start:end:step]",
    description: "数组切片操作",
  },
  {
    expression: "$[index]",
    description: "通过索引访问数组元素",
  },
  {
    expression: "$[start:end]",
    description: "通过范围访问数组子集",
  },
  {
    expression: "$[*]",
    description: "访问数组中的所有元素",
  },
  {
    expression: "$.length",
    description: "获取数组长度",
  },
  {
    expression: "$.key",
    description: "递归搜索指定键名的对象",
  },
  {
    expression: "$..key",
    description: "深度递归搜索指定键名的对象",
  },
  {
    expression: "$?(expression)",
    description: "过滤表达式",
  },
  {
    expression: "$.key == value",
    description: "用于过滤的比较表达式（等于）",
  },
  {
    expression: "$.key > value",
    description: "用于过滤的比较表达式（大于）",
  },
  {
    expression: "$.key < value",
    description: "用于过滤的比较表达式（小于）",
  },
  {
    expression: "$.key >= value",
    description: "用于过滤的比较表达式（大于等于）",
  },
  {
    expression: "$.key <= value",
    description: "用于过滤的比较表达式（小于等于）",
  },
  {
    expression: "$.key != value",
    description: "用于过滤的比较表达式（不等于）",
  },
  {
    expression: "$.key =~ /regex/",
    description: "用于过滤的正则表达式匹配",
  },
  {
    expression: "$.key in list",
    description: "用于过滤的包含在列表中",
  },
  {
    expression: "$.key nin list",
    description: "用于过滤的不包含在列表中",
  },
  {
    expression: "$.key like_regex 'pattern'",
    description: "用于过滤的正则表达式匹配（SQL风格）",
  },
  {
    expression: "$.key starts_with 'string'",
    description: "用于过滤的字符串开头匹配",
  },
];

export default function JSONPath() {
  const [pattern, setPattern] = createSignal("");
  const [text, setText] = createSignal("");
  const [output, setOutput] = createSignal("");
  createEffect(() => {
    if (pattern().length > 0 && text().length > 0) {
      parseJsonPath(text(), pattern())
        .then(setOutput)
        .catch((e) => setOutput(e.toString()));
    } else {
      setOutput("");
    }
  });
  return (
    <Container>
      {/*JSONPath*/}
      <Card>
        <div class="flex items-center justify-between">
          <span class="text-sm">JSONPath</span>
          <div class="flex items-center justify-center gap-2">
            <PasteButton onRead={setPattern} />
            <ClearButton onClick={() => setPattern("")} />
          </div>
        </div>
        <input
          class="input input-md w-full rounded-md outline-none"
          placeholder="输入 JSONPath 表达式"
          value={pattern()}
          onInput={(e) => setPattern(e.target.value)}
        />
      </Card>

      {/*JSON*/}
      <Card class="h-0 flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm">JSON</span>
          <div class="flex items-center justify-center gap-2">
            <TextOperateButtons callback={setText} />
          </div>
        </div>
        <Editor
          value={text()}
          onChange={setText}
          language="json"
          placeholder="输入需要解析的 JSON 数据"
        />
      </Card>

      <div class="flex h-0 flex-1 items-center justify-center gap-4">
        {/*匹配信息*/}
        <Card class="h-full flex-1 overflow-x-hidden">
          <div class="flex items-center justify-between">
            <span class="text-sm">结果</span>
          </div>
          <Editor language="json" value={output()} readOnly={true} />
        </Card>

        {/*速查表*/}
        <Card class="h-full flex-1 overflow-x-hidden">
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
                {JsonPathGrammars.map(({ expression, description }) => (
                  <tr class="hover:bg-base-300">
                    <td>{description}</td>
                    <td>{expression}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Container>
  );
}
