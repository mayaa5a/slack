"use client";

import { AppFrame } from "@/components/layout/app-frame";
import { MessagePane } from "@/components/main/message-pane";
import { ThreadPanel } from "@/components/main/thread-panel";

export function MainView() {
  return (
    <AppFrame>
      <div className="flex h-full min-w-0">
        <MessagePane />
        <ThreadPanel />
      </div>
    </AppFrame>
  );
}
