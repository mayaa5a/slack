"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSlackStore } from "@/lib/store/slack-store";

export function MessagePane() {
  const searchParams = useSearchParams();
  const {
    channels,
    allMessages,
    selectedChannelId,
    highlightedMessageId,
    clearHighlight,
    openThread,
    jumpToMessage,
  } = useSlackStore();

  useEffect(() => {
    const workspaceId = searchParams.get("workspace");
    const channelId = searchParams.get("channel");
    const messageId = searchParams.get("message");

    if (!workspaceId || !channelId || !messageId) {
      return;
    }

    jumpToMessage({ workspaceId, channelId, messageId });
  }, [searchParams, jumpToMessage]);

  useEffect(() => {
    if (!highlightedMessageId) {
      return;
    }

    const element = document.getElementById(`message-${highlightedMessageId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });

    const timeout = window.setTimeout(() => {
      clearHighlight();
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [highlightedMessageId, clearHighlight]);

  const channel = channels.find((item) => item.id === selectedChannelId);

  const messages = useMemo(
    () => allMessages.filter((message) => message.channelId === selectedChannelId),
    [allMessages, selectedChannelId]
  );

  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-[#eceff5] bg-white">
      <div className="border-b border-[#eceff5] px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">#{channel?.name ?? "Select channel"}</h1>
        <p className="text-sm text-[#64748b]">Team updates and discussion</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {messages.map((message) => {
            const isHighlighted = message.id === highlightedMessageId;

            return (
              <article
                key={message.id}
                id={`message-${message.id}`}
                onClick={() => openThread(message.id)}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  isHighlighted
                    ? "border-[#2f7fd1] bg-[#e8f2ff]"
                    : "border-transparent hover:border-[#e1e8f5] hover:bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#5b21b6] text-xs font-bold text-white">
                      {message.user.slice(0, 1)}
                    </span>
                    <p className="text-sm font-semibold">{message.user}</p>
                    <span className="text-xs text-[#64748b]">{message.ts}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openThread(message.id);
                    }}
                    className="rounded-md border border-[#d7deeb] px-2 py-1 text-xs text-[#475569] hover:bg-[#f3f6fb]"
                  >
                    Reply in thread
                  </button>
                </div>

                <p className="mt-2 text-sm text-[#111827]">{message.text}</p>

                <div className="mt-2 flex gap-2 text-[11px]">
                  {message.mentionedMe && (
                    <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[#92400e]">Mention</span>
                  )}
                  {message.requiresAction && (
                    <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[#991b1b]">Action required</span>
                  )}
                  {message.unread && (
                    <span className="rounded-full bg-[#e0e7ff] px-2 py-0.5 text-[#3730a3]">Unread</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#eceff5] bg-[#fafbfd] p-4">
        <div className="rounded-xl border border-[#d9e0ed] bg-white px-3 py-2 text-sm text-[#94a3b8]">
          Message #{channel?.name ?? "channel"}
        </div>
      </div>
    </section>
  );
}
