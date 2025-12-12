import { RouteSectionProps } from "@solidjs/router";
import {
  ArrowLeftRight,
  Badge,
  BadgePlus,
  Braces,
  Bubbles,
  CirclePercent,
  CirclePile,
  CodeXml,
  Database,
  DecimalsArrowRight,
  Dices,
  Earth,
  FileArchive,
  FileBracesCorner,
  FileText,
  GitCompareArrows,
  Hash,
  Heading,
  History,
  House,
  Image,
  LifeBuoy,
  Link,
  Network,
  PaintRoller,
  QrCode,
  Rainbow,
  Regex,
  Settings,
  Shell,
  ShieldPlus,
  SquareAsterisk,
  SquareChartGantt,
  Timer,
  Turntable,
  Type,
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
    label: "编码 & 解码",
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
      {
        label: "JWT",
        path: "/jwt",
        keywords: ["codec", "jwt"],
        component: lazy(() => import("./view/codec/jwt")),
        icon: Badge,
      },
      {
        label: "HTML",
        path: "/html",
        keywords: ["codec", "html"],
        component: lazy(() => import("./view/codec/html")),
        icon: Heading,
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
      {
        label: "转义 / 反转义",
        path: "/escape",
        keywords: ["text", "escape"],
        component: lazy(() => import("./view/text/escape")),
        icon: Type,
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
      {
        label: "数字进制",
        path: "/number",
        component: lazy(() => import("./view/converter/number")),
        icon: DecimalsArrowRight,
      },
      {
        label: "时间",
        path: "/time",
        component: lazy(() => import("./view/converter/time")),
        icon: Timer,
      },
    ],
  },
  {
    label: "加密 & 解密",
    path: "/crypto",
    icon: ShieldPlus,
    children: [
      {
        label: "RSA",
        path: "/crypto/rsa",
        icon: Bubbles,
        component: lazy(() => import("./view/crypto/rsa")),
      },
      {
        label: "SM2",
        path: "/crypto/sm2",
        icon: Rainbow,
        component: lazy(() => import("./view/crypto/sm2")),
      },
      {
        label: "SM4",
        path: "/crypto/sm4",
        icon: Shell,
        component: lazy(() => import("./view/crypto/sm4")),
      },
      {
        label: "AES",
        path: "/crypto/aes",
        icon: CirclePercent,
        component: lazy(() => import("./view/crypto/aes")),
      },
      {
        label: "DES",
        path: "/crypto/des",
        icon: LifeBuoy,
        component: lazy(() => import("./view/crypto/des")),
      },
    ],
  },
  {
    label: "网络",
    path: "/network",
    icon: Earth,
    children: [
      {
        label: "DNS 查询",
        path: "/network/dns",
        component: lazy(() => import("./view/network/dns")),
        icon: CirclePile,
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
