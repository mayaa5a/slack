"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSlackStore } from "@/lib/store/slack-store";

const navItems = [
  { label: "Home", href: "/" },
  { label: "DMs", href: "/" },
  { label: "Mentions", href: "/" },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    workspaces,
    channels,
    selectedWorkspaceId,
    selectedChannelId,
    setWorkspace,
    setChannel,
  } = useSlackStore();

  const visibleChannels = channels.filter((channel) => channel.workspaceId === selectedWorkspaceId);

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-[#3a2741] bg-[#351d3b] px-3 py-3 text-[#f8f8f8]">
      <div className="mb-4 rounded-xl bg-[#4a2b55] p-2">
        <p className="px-2 text-xs uppercase tracking-[0.15em] text-[#d8cae0]">Workspaces</p>
        <div className="mt-2 space-y-1">
          {workspaces.map((workspace) => {
            const isActive = workspace.id === selectedWorkspaceId;
            return (
              <button
                key={workspace.id}
                type="button"
                onClick={() => setWorkspace(workspace.id)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-[#6f4a7c] ${
                  isActive ? "bg-[#7e5a8a]" : ""
                }`}
              >
                <span>{workspace.name}</span>
                {workspace.unreadCount > 0 && (
                  <span className="rounded-full bg-[#d83d7d] px-2 py-0.5 text-xs font-semibold">
                    {workspace.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1 px-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-md px-2 py-1.5 text-sm text-[#f0e9f3] transition hover:bg-[#5f3f6a]"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Link
        href="/dashboard"
        className={`mt-3 block rounded-lg px-3 py-2 text-sm font-semibold transition ${
          pathname === "/dashboard"
            ? "bg-[#1f9f6d] text-white"
            : "bg-[#178a5f] text-white hover:bg-[#1da36f]"
        }`}
      >
        AI Dashboard
      </Link>

      <div className="mt-5 flex-1 overflow-y-auto rounded-xl bg-[#2e1733] p-2">
        <p className="px-2 text-xs uppercase tracking-[0.15em] text-[#baaac2]">Channels</p>
        <div className="mt-2 space-y-1">
          {visibleChannels.map((channel) => {
            const isActive = channel.id === selectedChannelId;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => setChannel(channel.id)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-[#5f3f6a] ${
                  isActive ? "bg-[#6d4b79]" : ""
                }`}
              >
                <span>#{channel.name}</span>
                {channel.unreadCount > 0 && (
                  <span className="rounded-full bg-[#5f3f6a] px-1.5 py-0.5 text-xs">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
