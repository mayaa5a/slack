"use client";

import Link from "next/link";
import { AppFrame } from "@/components/layout/app-frame";
import { summarizeMissedMessages } from "@/lib/summarize/summarizer";
import { useSlackStore } from "@/lib/store/slack-store";

export function DashboardPage() {
  const { allMessages, workspaces, channels } = useSlackStore();

  const summary = summarizeMissedMessages(allMessages, workspaces);

  const getChannelName = (channelId: string) => channels.find((channel) => channel.id === channelId)?.name;
  const workspaceColors: Record<string, string> = {
    "ws-ut": "border-l-[#2eb67d] bg-[#eefaf6] text-[#0f5132]",
    "ws-intern": "border-l-[#ecb22e] bg-[#fff8e6] text-[#7c5b12]",
    "ws-class": "border-l-[#36c5f0] bg-[#ecf8ff] text-[#0b4a63]",
  };
  const workspaceLegend: Record<
    string,
    { label: string; dot: string; ring: string }
  > = {
    "ws-ut": {
      label: "UT Org",
      dot: "bg-[#2eb67d]",
      ring: "ring-[#2eb67d]/30",
    },
    "ws-intern": {
      label: "Internship",
      dot: "bg-[#ecb22e]",
      ring: "ring-[#ecb22e]/30",
    },
    "ws-class": {
      label: "Class Project",
      dot: "bg-[#36c5f0]",
      ring: "ring-[#36c5f0]/30",
    },
  };

  return (
    <AppFrame>
      <div className="h-full overflow-y-auto bg-[#f4f7fb] p-6">
        <section className="rounded-2xl border border-[#dae3f2] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">AI Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">
            Cross-workspace missed update digest
          </h1>
          <div className="mt-4 grid gap-3">
            {summary.whatYouMissed.map((item) => {
              const match = item.match(/^(\d+)\s(.+)$/);
              const count = match?.[1];
              const rest = match?.[2] ?? item;

              return (
                <p
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[#dbe3f1] bg-gradient-to-r from-[#e9f0ff] to-[#f8fafc] px-4 py-3 text-sm font-medium text-[#0f172a]"
                >
                  {count ? (
                    <span className="text-2xl font-bold text-[#1d4ed8]">{count}</span>
                  ) : null}
                  <span>{rest}</span>
                </p>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#dae3f2] bg-white p-5">
          <h2 className="text-lg font-semibold">Top priorities</h2>
          <div className="mt-3 space-y-3">
            {summary.priorities.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#f7b9c6] bg-[#fde7ec] p-3">
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Action items extracted</h2>
            <div className="flex flex-wrap items-center gap-2">
              {workspaces.map((workspace) => {
                const legend = workspaceLegend[workspace.id];
                if (!legend) {
                  return null;
                }
                return (
                  <span
                    key={workspace.id}
                    className={`inline-flex items-center gap-2 rounded-full border border-[#e2e8f3] bg-white px-2.5 py-1 text-xs text-[#475569] ring-2 ${legend.ring}`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${legend.dot}`} />
                    {legend.label}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {summary.actionItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border border-[#e2e8f3] border-l-4 p-3 ${
                  workspaceColors[item.source.workspaceId] ?? "bg-white text-[#111827]"
                }`}
              >
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
