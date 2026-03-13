import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CartProvider } from "./hooks/use-cart";
import { Layout } from "./components/layout";

// Pages
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import Order from "./pages/order";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order/:id" component={Order} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster 
          position="bottom-center" 
          richColors 
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              borderRadius: "1rem",
              border: "2px solid var(--color-border)",
            }
          }}
        />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
