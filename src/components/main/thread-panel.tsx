"use client";

import { useSlackStore } from "@/lib/store/slack-store";

export function ThreadPanel() {
  const { allMessages, threadMessageId, closeThread } = useSlackStore();

  if (!threadMessageId) {
    return null;
  }

  const message = allMessages.find((item) => item.id === threadMessageId);

  if (!message) {
    return null;
  }

  return (
    <aside className="flex w-[340px] shrink-0 flex-col bg-[#f8fafc]">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3">
        <p className="text-sm font-semibold">Thread</p>
        <button
          type="button"
          onClick={closeThread}
          className="rounded-md border border-[#d6deea] px-2 py-1 text-xs text-[#475569] hover:bg-white"
        >
          Close
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <article className="rounded-lg border border-[#dbe3ef] bg-white p-3">
          <p className="text-xs font-semibold text-[#111827]">{message.user}</p>
          <p className="mt-1 text-sm text-[#0f172a]">{message.text}</p>
        </article>

        <div className="mt-3 space-y-2">
          {(message.thread ?? []).map((reply) => (
            <article key={reply.id} className="rounded-lg border border-[#e3e8f2] bg-white p-3">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold">{reply.user}</p>
                <span className="text-[11px] text-[#64748b]">{reply.ts}</span>
              </div>
              <p className="mt-1 text-sm">{reply.text}</p>
            </article>
          ))}
          {message.thread?.length ? null : (
            <p className="text-xs text-[#64748b]">No replies yet. Start the thread.</p>
          )}
        </div>
      </div>

      <div className="border-t border-[#e2e8f0] bg-white p-3">
        <div className="rounded-lg border border-[#d8e0eb] px-3 py-2 text-sm text-[#94a3b8]">
          Reply in thread
        </div>
      </div>
    </aside>
  );
}
