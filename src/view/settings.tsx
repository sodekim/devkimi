import { openDevtools } from "@/command/devtools";
import { getSystemFonts } from "@/command/font";
import { openLogDir } from "@/command/fs";
import Config from "@/component/Config";
import Editor, { MonacoEditor } from "@/component/Editor";
import Link from "@/component/Link";
import { CloseBehavior, useSettings, WordWrap } from "@/store";
import { trackStore } from "@solid-primitives/deep";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import {
  AudioLines,
  CalendarCheck,
  CaseSensitive,
  DatabaseZap,
  ExternalLink,
  FolderOpen,
  MonitorX,
  OctagonAlert,
  Palette,
  RectangleEllipsis,
  SquareTerminal,
  TextWrap,
} from "lucide-solid";
import { createEffect, createResource } from "solid-js";
//
// 主题
const THEMES_OPTIONS = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "Dracula",
    value: "dracula",
  },
];

///
// 日志级别
const LOG_LEVEL = ["trace", "debug", "info", "warn", "error"] as const;

export default function Settings() {
  const editors = [] as MonacoEditor[];
  const [settings, setSettings] = useSettings();
  const [version] = createResource<{ app: string; tauri: string }>(async () => {
    const app = await getVersion();
    const tauri = await getTauriVersion();
    return { app, tauri };
  });

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
      <Config.Card label="系统" collapse={false}>
        <Config.Option
          label="关闭行为"
          icon={() => <MonitorX size={16} />}
          description="控制应用关闭时的行为"
        >
          <Config.Select
            class="w-30"
            value={settings.system.closeBehavior}
            options={[
              { label: "退出", value: "quit" },
              { label: "系统托盘", value: "tray" },
            ]}
            onChange={(value) =>
              setSettings("system", "closeBehavior", value as CloseBehavior)
            }
          ></Config.Select>
        </Config.Option>

        <Config.Option
          label="缓存数据"
          icon={() => <DatabaseZap size={16} />}
          description="是否将工具的配置选项以及输入参数缓存到本地，切换工具后数据不会丢失。"
        >
          <Config.Switch
            value={settings.system.cachable}
            onChange={(value) => setSettings("system", "cachable", value)}
          />
        </Config.Option>
      </Config.Card>

      {/* 界面 */}
      <Config.Card label="界面" collapse={false}>
        {/* 主题 */}
        <Config.Option
          label="主题"
          icon={() => <Palette size={16} />}
          description="切换主界面的主题"
        >
          <Config.Select
            options={THEMES_OPTIONS}
            value={settings.common.theme}
            class="w-30"
            onChange={(value) => setSettings("common", "theme", value)}
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

      <Config.Card label="调试" collapse={false}>
        <Config.Option
          label="日志级别"
          icon={() => <RectangleEllipsis size={16} />}
          description="控制日志输出的级别，修改后需要重启生效。"
        >
          <Config.Select
            class="w-40"
            value={settings.debug.level}
            options={LOG_LEVEL.map((level) => ({ label: level, value: level }))}
            onChange={(value) => setSettings("debug", "level", value)}
          ></Config.Select>
        </Config.Option>
        <Config.Option
          label="Web控制台"
          icon={() => <SquareTerminal size={16} />}
          description="打开Web控制台，调试接口和界面。"
        >
          <Link label="打开" onClick={() => openDevtools()} />
        </Config.Option>
        <Config.Option
          label="日志目录"
          icon={() => <FolderOpen size={16} />}
          description="打开日志目录，查看应用日志文件。"
        >
          <Link label="打开" onClick={() => openLogDir()} />
        </Config.Option>
      </Config.Card>

      <Config.Card label="关于" collapse={false}>
        <Config.Option label="链接" icon={() => <ExternalLink size={16} />}>
          <div class="join gap-2">
            <Link label="源代码" href="https://github.com/sodekim/devkimi" />
            <Link
              label="许可证"
              href="https://github.com/sodekim/devkimi/blob/main/LICENSE"
            />
          </div>
        </Config.Option>
        <Config.Option label="Devkimi" icon={() => <OctagonAlert size={16} />}>
          <div class="join gap-2">
            <span class="text-sm">App: {version()?.app ?? "-"}</span>
            <span class="text-sm">Tauri: {version()?.tauri ?? "-"}</span>
          </div>
        </Config.Option>
      </Config.Card>
    </div>
  );
}
