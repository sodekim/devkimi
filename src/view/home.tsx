import Container from "@/component/Container";
import Logo from "@/component/Logo";
import { Github } from "lucide-solid";

export default function Home() {
  return (
    <Container class="items-center justify-center">
      <div class="h-20 w-full">
        <Logo />
      </div>
      <div class="flex flex-col items-center justify-center">
        <div class="text-2xl font-bold">欢迎使用 Devkimi 开发者工具</div>
      </div>
    </Container>
  );
}
