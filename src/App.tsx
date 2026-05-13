import { CliRoute } from "./routes/CliRoute";
import { DemoRoute } from "./routes/DemoRoute";
import { DesktopRoute } from "./routes/DesktopRoute";
import { HandoffRoute } from "./routes/HandoffRoute";
import { LauncherRoute } from "./routes/LauncherRoute";

function currentPath() {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path || "/";
}

export default function App() {
  const path = currentPath();

  if (path === "/demo") return <DemoRoute />;
  if (path === "/desktop") return <DesktopRoute />;
  if (path === "/cli") return <CliRoute />;
  if (path === "/handoff") return <HandoffRoute />;
  return <LauncherRoute />;
}
