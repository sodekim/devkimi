import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, For, Suspense, type Component } from "solid-js";
import Layout from "./component/Layout";
import { RouteMeta, routeMetas } from "./routes";
import { StoreProvider } from "./store";
import Card from "./component/Card";
import { twMerge } from "tailwind-merge";
import { RefreshCcw } from "lucide-solid";

const App: Component = () => {
  // 创建Solid路由对象
  const route = (meta: RouteMeta) => {
    const children = meta.children || [];
    return (
      <Route
        path={meta.path}
        component={meta.component}
        info={{ label: meta.label, icon: meta.icon }}
      >
        {children.map(route)}
      </Route>
    );
  };

  // 路由表
  const Routes = () => routeMetas.map(route);

  // App界面
  return (
    <Router
      root={(props) => {
        return (
          <MetaProvider>
            <Title>Devkimi</Title>
            <StoreProvider>
              <Layout>
                <ErrorBoundary
                  fallback={(error, reset) => {
                    const lines = error.stack?.split("\n") || [];
                    return (
                      <Card class="w-full items-center justify-center gap-4 overflow-hidden">
                        <div class="mockup-code flex flex-col p-4">
                          <For each={lines}>
                            {(line, index) => (
                              <div
                                class={twMerge(
                                  "text-md font-mono font-bold",
                                  index() !== 0 && "ml-4",
                                )}
                              >
                                {line}
                              </div>
                            )}
                          </For>
                        </div>
                        <button class="btn btn-primary" onClick={reset}>
                          <RefreshCcw size={16} />
                          刷新
                        </button>
                      </Card>
                    );
                  }}
                >
                  <Suspense>{props.children}</Suspense>
                </ErrorBoundary>
              </Layout>
            </StoreProvider>
          </MetaProvider>
        );
      }}
    >
      <Routes />
    </Router>
  );
};

export default App;
