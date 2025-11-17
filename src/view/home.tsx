import { useNavigate } from "@solidjs/router";
import Container from "../component/Container";
import { routeMetas } from "../routes";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div class="flex size-full flex-col gap-4 overflow-y-auto">
      {routeMetas
        .filter((meta) => meta.children && meta.children.length > 0)
        .map((meta) => {
          const children = meta.children || [];
          return (
            <Container class="gap-4">
              <div class="flex items-center justify-start gap-2">
                <span class="text-primary">
                  {meta.icon && meta.icon({ size: 14 })}
                </span>
                <span class="text-sm font-bold">{meta.label}</span>
              </div>
              <div class="flex w-full flex-wrap gap-4">
                {children.map((child) => (
                  <button
                    class="btn h-20 w-60 items-center justify-center gap-2"
                    onClick={() => navigate(`${meta.path}${child.path}`)}
                  >
                    <span>
                      {child.icon &&
                        child.icon({
                          size: 16,
                          color: "var(--color-primary)",
                        })}
                    </span>
                    <span class="text-sm font-bold">{child.label}</span>
                  </button>
                ))}
              </div>
            </Container>
          );
        })}
    </div>
  );
}
