import Page from "@/component/Page";
import Logo from "@/component/Logo";

export default function Home() {
  return (
    <Page class="items-center justify-center">
      <div class="h-20 w-full">
        <Logo />
      </div>
      <div class="flex flex-col items-center justify-center">
        <div class="text-2xl font-bold">欢迎使用 Devkimi 开发者工具</div>
      </div>
    </Page>
  );
}
