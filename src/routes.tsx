import { RouteSectionProps } from "@solidjs/router";
import {
  ArrowLeftRight,
  BadgePlus,
  Braces,
  CodeXml,
  Database,
  Dices,
  FileArchive,
  FileBracesCorner,
  FileText,
  GitCompareArrows,
  Hash,
  History,
  House,
  Image,
  Link,
  PaintRoller,
  QrCode,
  Regex,
  Settings,
  ShieldPlus,
  SquareAsterisk,
  SquareChartGantt,
  Turntable
} from "lucide-solid";
import { Component, JSX, lazy } from "solid-js";

interface RouteMeta<T = unknown> {
  label: string;
  path: string;
  keywords?: string[];
  icon?: (props: Record<string, any>) => JSX.Element;
  component?: Component<RouteSectionProps<T>>;
  children?: RouteMeta[];
  hidden?: boolean;
}

const routeMetas: RouteMeta[] = [
  {
    label: "格式化工具",
    path: "/formatter",
    icon: PaintRoller,
    children: [
      {
        label: "JSON",
        path: "/json",
        keywords: ["json", "format"],
        icon: Braces,
        component: lazy(() => import("./view/formatter/json")),
      },
      {
        label: "SQL",
        path: "/sql",
        keywords: ["database", "format", "sql"],
        icon: Database,
        component: lazy(() => import("./view/formatter/sql")),
      },
      {
        label: "XML",
        path: "/xml",
        keywords: ["format", "xml"],
        icon: CodeXml,
        component: lazy(() => import("./view/formatter/xml")),
      },
    ],
  },
  {
    label: "编解码器",
    path: "/codec",
    icon: GitCompareArrows,
    children: [
      {
        label: "Base64 文本",
        path: "/base64_text",
        keywords: ["codec", "text"],
        component: lazy(() => import("./view/codec/base64_text")),
        icon: FileText,
      },
      {
        label: "Base64 图片",
        path: "/base64_image",
        keywords: ["codec", "image"],
        component: lazy(() => import("./view/codec/base64_image")),
        icon: Image,
      },
      {
        label: "GZip",
        path: "/gzip",
        keywords: ["codec", "compress", "decompress"],
        component: lazy(() => import("./view/codec/gzip")),
        icon: FileArchive,
      },
      {
        label: "URL",
        path: "/url",
        keywords: ["codec", "url"],
        component: lazy(() => import("./view/codec/url")),
        icon: Link,
      },
      {
        label: "二维码",
        path: "/qrcode",
        keywords: ["codec", "qrcode"],
        component: lazy(() => import("./view/codec/qrcode")),
        icon: QrCode,
      },
    ],
  },
  {
    label: "文本工具",
    path: "/text",
    icon: SquareChartGantt,
    children: [
      {
        label: "Markdown 预览",
        path: "/markdown",
        keywords: ["preview", "markdown"],
        component: lazy(() => import("./view/text/markdown")),
        icon: Turntable,
      },
      {
        label: "正则表达式",
        path: "/regex",
        keywords: ["text", "regex"],
        component: lazy(() => import("./view/text/regex")),
        icon: Regex,
      },
      {
        label: "JSONPath",
        path: "/jsonpath",
        keywords: ["text", "json", "path"],
        component: lazy(() => import("./view/text/jsonpath")),
        icon: FileBracesCorner,
      },
    ],
  },
  {
    label: "生成器",
    path: "/generator",
    icon: BadgePlus,
    children: [
      {
        label: "UUID",
        path: "/uuid",
        keywords: ["generate", "random", "uuid"],
        icon: Dices,
        component: lazy(() => import("./view/generator/uuid")),
      },
      {
        label: "密码",
        path: "/password",
        keywords: ["generate", "random", "password"],
        icon: SquareAsterisk,
        component: lazy(() => import("./view/generator/password")),
      },
      {
        label: "哈希",
        path: "/hash",
        keywords: ["generate", "hash", "md5", "sha1", "sha2"],
        icon: Hash,
        component: lazy(() => import("./view/generator/hash")),
      },
    ],
  },
  {
    label: "转换器",
    path: "/converter",
    icon: ArrowLeftRight,
    children: [
      {
        label: "Cron 解析器",
        path: "/cron",
        component: lazy(() => import("./view/converter/cron")),
        icon: History,
      },
      {
        label: "JSON <> YAML",
        path: "/json_yaml",
        component: lazy(() => import("./view/converter/json_yaml")),
        icon: CodeXml,
      },
      {
        label: "YAML <> PROPERTIES",
        path: "/yaml_properties",
        component: lazy(() => import("./view/converter/yaml_properties")),
        icon: FileBracesCorner,
      },
    ],
  },
  {
    label: "加解密",
    path: "/crypto",
    icon: ShieldPlus,
    children: [
      {
        label: "RSA",
        path: "/crypto/rsa",
        icon: ArrowLeftRight,
        component: lazy(() => import("./view/crypto/rsa")),
      },
      {
        label: "SM4",
        path: "/crypto/sm4",
        icon: ArrowLeftRight,
        component: lazy(() => import("./view/crypto/sm4")),
      },
      {
        label: "AES",
        path: "/crypto/aes",
        icon: ArrowLeftRight,
        component: lazy(() => import("./view/crypto/aes")),
      },
      {
        label: "DES",
        path: "/crypto/des",
        icon: ArrowLeftRight,
        component: lazy(() => import("./view/crypto/des")),
      },

    ],
  },
  {
    label: "设置",
    path: "/settings",
    component: lazy(() => import("./view/settings")),
    icon: Settings,
    hidden: true,
  },
  {
    label: "主页",
    path: "/*home",
    component: lazy(() => import("./view/home")),
    icon: House,
    hidden: true,
  },
];

export { routeMetas };
export type { RouteMeta };

