import { load } from "@tauri-apps/plugin-store";
import { ALargeSmall, CaseSensitive, Palette } from "lucide-solid";
import { createEffect, createResource } from "solid-js";
import { getSystemFonts } from "../command/font";
import Config from "../component/Config";
import Editor, { MonacoEditor } from "../component/Editor";
import { useSettings } from "../store";
//
// 主题
const THEMES = ["light", "dark"];

export default function Settings() {
  const editors = [] as MonacoEditor[];
  const [settings, setSettings] = useSettings();

  // 更新编辑器主题
  createEffect(() => {
    const theme = settings.theme;
    editors.map((editor) => editor.updateOptions({ theme }));
  });

  // 更新编辑器字体大小
  createEffect(() => {
    const fontSize = settings.font.size;
    editors.map((editor) => editor.updateOptions({ fontSize }));
  });

  // 更新编辑器字体
  createEffect(() => {
    const fontFamily = settings.font.family;
    editors.map((editor) => editor.updateOptions({ fontFamily }));
  });

  // 系统字体
  const [fonts] = createResource(async () => {
    const fonts = await getSystemFonts();
    return fonts.map((font) => ({
      label: font,
      value: font,
    }));
  });

  return (
    <div class="flex flex-col gap-2">
      {/* 外观 */}
      <Config.Card label="外观">
        {/* 主题 */}
        <Config.Option
          label="主题"
          description="设置界面主题"
          icon={() => <Palette size={16} />}
        >
          <Config.Select
            options={THEMES.map((theme) => ({ label: theme, value: theme }))}
            value={() => settings.theme}
            class="w-30"
            onChange={(value) => setSettings("theme", value)}
          />
        </Config.Option>
      </Config.Card>

      {/* 编辑器 */}
      <Config.Card label="编辑器">
        {/* 编辑器字体 */}
        <Config.Option
          label="字体"
          description="设置字体"
          icon={() => <CaseSensitive size={16} />}
        >
          <Config.Select
            options={fonts}
            class="w-60"
            value={() => settings.font.family}
            onChange={(value) => setSettings("font", "family", value)}
          />
        </Config.Option>

        <Config.Option
          label="字体大小"
          description="设置字体大小"
          icon={() => <ALargeSmall size={16} />}
        >
          <Config.NumberInput
            value={() => settings.font.size}
            onInput={(value) => setSettings("font", "size", value)}
            class="w-30"
          />
        </Config.Option>

        <div class="flex h-30 w-full flex-col gap-2">
          <span class="text-base-content/60 text-xs">预览</span>
          <Editor
            value={() =>
              "Many years later as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice."
            }
            wordWrap="on"
            onSetup={(editor) => editors.push(editor)}
          />
        </div>
      </Config.Card>
    </div>
  );
}
