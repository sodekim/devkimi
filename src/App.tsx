import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { Suspense, type Component } from "solid-js";
import Layout from "./component/Layout";
import { RouteMeta, routeMetas } from "./routes";
import { StoreProvider } from "./store";

const App: Component = () => {
  // RouteMeta => Solid Route
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

  return (
    <Router
      root={(props) => {
        return (
          <MetaProvider>
            <Title>DevKimi</Title>
            <StoreProvider>
              <Layout>
                <Suspense>{props.children}</Suspense>
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
