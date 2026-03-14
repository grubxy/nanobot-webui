import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SetupGuideDialog } from "../shared/SetupGuideDialog";
import { cn } from "../../lib/utils";

export default function AppLayout() {
  const { pathname } = useLocation();
  const isChatPage = pathname.startsWith("/chat");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main className={cn(
        "relative flex-1 min-w-0",
        isChatPage ? "overflow-hidden" : "overflow-auto p-5"
      )}>
        <Outlet />
      </main>
      <SetupGuideDialog />
    </div>
  );
}
