import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IdleTimer } from "@/components/IdleTimer";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Deposit from "@/pages/Deposit";
import Booking from "@/pages/Booking";
import About from "@/pages/About";
import Success from "@/pages/Success";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/booking" component={Booking} />
      <Route path="/about" component={About} />
      <Route path="/success" component={Success} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <IdleTimer />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
