"use client";

import { ReactNode } from "react";
import { SlackStoreProvider } from "@/lib/store/slack-store";

export function SlackProvider({ children }: { children: ReactNode }) {
  return <SlackStoreProvider>{children}</SlackStoreProvider>;
}
