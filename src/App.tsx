import { CliRoute } from "./routes/CliRoute";
import { GuiRoute } from "./routes/GuiRoute";
import { LandingRoute } from "./routes/LandingRoute";

export default function App() {
  const path = window.location.pathname;

  if (path === "/cli" || path === "/demo") {
    return <CliRoute />;
  }

  if (path === "/gui") {
    return <GuiRoute />;
  }

  return <LandingRoute />;
}
