"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useSlackStore } from "@/lib/store/slack-store";

export function AppFrame({ children }: { children: ReactNode }) {
  const { selectedWorkspaceId, workspaces } = useSlackStore();

  const activeWorkspace = workspaces.find((workspace) => workspace.id === selectedWorkspaceId);

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_top,#f9fafc,#edf2f7)] text-[#1d1c1d]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e8ef] bg-white px-5">
          <div className="w-full max-w-2xl">
            <div className="flex items-center rounded-lg border border-[#d4dae5] bg-[#f7f9fc] px-3 py-2">
              <span className="text-sm text-[#64748b]">Search messages, files, people</span>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-[#6b7280]">Workspace</p>
              <p className="text-sm font-semibold">{activeWorkspace?.name ?? "Loading"}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1264a3] text-sm font-bold text-white">
              MY
            </div>
          </div>
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
