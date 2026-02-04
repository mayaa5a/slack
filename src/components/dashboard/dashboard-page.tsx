"use client";

import Link from "next/link";
import { AppFrame } from "@/components/layout/app-frame";
import { summarizeMissedMessages } from "@/lib/summarize/summarizer";
import { useSlackStore } from "@/lib/store/slack-store";

export function DashboardPage() {
  const { allMessages, workspaces, channels } = useSlackStore();

  const summary = summarizeMissedMessages(allMessages, workspaces);

  const getChannelName = (channelId: string) => channels.find((channel) => channel.id === channelId)?.name;

  return (
    <AppFrame>
      <div className="h-full overflow-y-auto bg-[#f4f7fb] p-6">
        <section className="rounded-2xl border border-[#dae3f2] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">AI Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Cross-workspace missed update digest</h1>
          <div className="mt-4 grid gap-2">
            {summary.whatYouMissed.map((item) => (
              <p key={item} className="rounded-lg bg-[#eef4ff] px-3 py-2 text-sm text-[#1e3a8a]">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#dae3f2] bg-white p-5">
          <h2 className="text-lg font-semibold">Top priorities</h2>
          <div className="mt-3 space-y-3">
            {summary.priorities.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#e2e8f3] p-3">
                <p className="text-sm font-medium text-[#111827]">{item.title}</p>
                <p className="mt-1 text-xs text-[#64748b]">Why it matters: {item.reason}</p>
                <Link
                  className="mt-2 inline-flex text-xs font-semibold text-[#1264a3] hover:underline"
                  href={`/?workspace=${item.source.workspaceId}&channel=${item.source.channelId}&message=${item.source.messageId}`}
                >
                  Jump to message
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#dae3f2] bg-white p-5">
          <h2 className="text-lg font-semibold">Workspaces</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {summary.workspaces.map((workspace) => (
              <article key={workspace.workspaceId} className="rounded-xl border border-[#e2e8f3] p-3">
                <p className="text-sm font-semibold">{workspace.workspaceName}</p>
                <p className="mt-1 text-sm text-[#475569]">{workspace.summary}</p>
                <div className="mt-2 space-y-2">
                  {workspace.highlights.map((highlight) => (
                    <div key={highlight.id} className="rounded-md bg-[#f8fafc] p-2">
                      <p className="text-xs text-[#0f172a]">{highlight.title}</p>
                      <Link
                        className="mt-1 inline-flex text-[11px] font-semibold text-[#1264a3] hover:underline"
                        href={`/?workspace=${highlight.source.workspaceId}&channel=${highlight.source.channelId}&message=${highlight.source.messageId}`}
                      >
                        Jump to #{getChannelName(highlight.source.channelId) ?? "channel"}
                      </Link>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#dae3f2] bg-white p-5">
          <h2 className="text-lg font-semibold">Action items extracted</h2>
          <div className="mt-3 space-y-2">
            {summary.actionItems.map((item) => (
              <label key={item.id} className="flex items-start gap-3 rounded-lg border border-[#e2e8f3] p-3">
                <input type="checkbox" className="mt-0.5" />
                <span className="flex-1 text-sm text-[#111827]">{item.text}</span>
                <Link
                  className="text-xs font-semibold text-[#1264a3] hover:underline"
                  href={`/?workspace=${item.source.workspaceId}&channel=${item.source.channelId}&message=${item.source.messageId}`}
                >
                  Jump to message
                </Link>
              </label>
            ))}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
