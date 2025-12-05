import { trackStore } from "@solid-primitives/deep";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  AudioLines,
  CaseSensitive,
  LayoutTemplate,
  Link,
  OctagonAlert,
  Palette,
  TextWrap,
} from "lucide-solid";
import { createEffect, createResource } from "solid-js";
import { getSystemFonts } from "../command/font";
import Config from "../component/Config";
import Editor, { MonacoEditor } from "../component/Editor";
import { IOLayout, useSettings, WordWrap } from "../store";
//
// 主题
const THEMES = ["light", "dark"];

export default function Settings() {
  const editors = [] as MonacoEditor[];
  const [settings, setSettings] = useSettings();

  // 系统字体
  const [fonts] = createResource(async () => {
    const fonts = await getSystemFonts();
    return fonts.map((font) => ({
      label: font,
      value: font,
    }));
  });

  // 更新界面主题
  createEffect(() => {
    const theme = settings.common.theme;
    editors.forEach((editor) => editor.updateOptions({ theme }));
  });

  // 更新编辑器
  createEffect(() => {
    trackStore(settings.editor);
    editors.forEach((editor) =>
      editor.updateOptions({
        wordWrap: settings.editor.wordWrap,
        fontSize: settings.editor.font.size,
        fontFamily: settings.editor.font.family,
      }),
    );
  });

  return (
    <div class="flex h-full flex-1 flex-col gap-4 overflow-auto">
      {/* 界面 */}
      <Config.Card label="界面" collapse={false}>
        {/* 主题 */}
        <Config.Option
          label="主题"
          icon={() => <Palette size={16} />}
          description="切换主界面的主题"
        >
          <Config.Select
            options={THEMES.map((theme) => ({ label: theme, value: theme }))}
            value={settings.common.theme}
            class="w-30"
            onChange={(value) => setSettings("common", "theme", value)}
          />
        </Config.Option>

        <Config.Option
          label="输入输出布局"
          icon={() => <LayoutTemplate size={16} />}
          description="工具界面控制输入 / 输出区域的布局。"
        >
          <Config.Select
            value={settings.common.ioLayout}
            options={[
              { label: "左右布局", value: "horizontal" },
              { label: "上下布局", value: "vertical" },
            ]}
            onChange={(value) =>
              setSettings("common", "ioLayout", value as IOLayout)
            }
            class="w-30"
          />
        </Config.Option>

        <Config.Option
          label="配置默认展开"
          icon={() => <TextWrap size={16} />}
          description="控制切换到工具界面时顶部的配置区域是否默认展开"
        >
          <Config.Switch
            value={settings.common.openConfigCollapse}
            onChange={(value) =>
              setSettings("common", "openConfigCollapse", value)
            }
          />
        </Config.Option>
      </Config.Card>

      {/* 编辑器 */}
      <Config.Card label="编辑器" collapse={false}>
        {/* 编辑器字体 */}
        <Config.Option
          label="字体"
          icon={() => <CaseSensitive size={16} />}
          description="编辑器中显示文字的字体"
        >
          <Config.Select
            options={fonts()}
            class="w-60"
            value={settings.editor.font.family}
            onChange={(value) => setSettings("editor", "font", "family", value)}
          />
        </Config.Option>

        <Config.Option
          label="字体大小"
          icon={() => <AudioLines size={16} />}
          description="编辑器中显示文字的大小"
        >
          <Config.NumberInput
            value={settings.editor.font.size}
            onInput={(value) => setSettings("editor", "font", "size", value)}
            class="w-30"
          />
        </Config.Option>

        <Config.Option
          label="自动换行"
          description="长度超过编辑器宽度时是否自动换行显示"
          icon={() => <TextWrap size={16} />}
        >
          <Config.Select
            value={settings.editor.wordWrap}
            options={[
              { label: "On", value: "on" },
              { label: "WordWrapColumn", value: "wordWrapColumn" },
              { label: "Bounded", value: "bounded" },
              { label: "Off", value: "off" },
            ]}
            onChange={(value) =>
              setSettings("editor", "wordWrap", value as WordWrap)
            }
            class="w-40"
          />
        </Config.Option>

        <div class="flex h-30 w-full flex-col gap-2">
          <span class="text-base-content/60 text-xs">预览</span>
          <Editor
            language="markdown"
            value={
              "Many years later as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice."
            }
            onSetup={(editor) => editors.push(editor)}
          />
        </div>
      </Config.Card>

      <Config.Card label="关于" collapse={false}>
        <Config.Option label="链接" icon={() => <Link size={16} />}>
          <div class="join gap-2">
            <a
              class="link link-primary"
              onClick={() => openUrl("https://github.com/sodekim/devkimi.git")}
            >
              源代码
            </a>
            <a
              class="link link-primary"
              onClick={() =>
                openUrl("https://github.com/sodekim/devkimi/blob/main/LICENSE")
              }
            >
              许可证
            </a>
          </div>
        </Config.Option>
        <Config.Option label="Devkimi" icon={() => <OctagonAlert size={16} />}>
          <div class="join gap-2">
            <span class="text-sm">App: {settings.version.app}</span>
            <span class="text-sm">Tauri: {settings.version.tauri}</span>
          </div>
        </Config.Option>
      </Config.Card>
    </div>
  );
}
