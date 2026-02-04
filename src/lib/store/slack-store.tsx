"use client";

import { slackService } from "@/lib/services/slackService";
import { Channel, Message, Workspace } from "@/types/slack";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type JumpTarget = {
  workspaceId: string;
  channelId: string;
  messageId: string;
};

type SlackStoreState = {
  workspaces: Workspace[];
  channels: Channel[];
  allMessages: Message[];
  selectedWorkspaceId: string;
  selectedChannelId: string;
  threadMessageId: string | null;
  highlightedMessageId: string | null;
  setWorkspace: (workspaceId: string) => void;
  setChannel: (channelId: string) => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  clearHighlight: () => void;
  jumpToMessage: (target: JumpTarget) => void;
};

const SlackStoreContext = createContext<SlackStoreState | undefined>(undefined);

export function SlackStoreProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [threadMessageId, setThreadMessageId] = useState<string | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [workspaceData, allMessageData] = await Promise.all([
        slackService.getWorkspaces(),
        slackService.getAllMessages(),
      ]);

      setWorkspaces(workspaceData);
      setAllMessages(allMessageData);

      if (!workspaceData.length) {
        return;
      }

      const firstWorkspaceId = workspaceData[0].id;
      const initialChannels = await slackService.getChannels(firstWorkspaceId);

      const otherChannelSets = await Promise.all(
        workspaceData.slice(1).map((workspace) => slackService.getChannels(workspace.id))
      );

      setChannels([...initialChannels, ...otherChannelSets.flat()]);
      setSelectedWorkspaceId(firstWorkspaceId);
      setSelectedChannelId(initialChannels[0]?.id ?? "");
    };

    load();
  }, []);

  const setWorkspace = useCallback(
    (workspaceId: string) => {
      setSelectedWorkspaceId(workspaceId);
      const nextChannel = channels.find((channel) => channel.workspaceId === workspaceId);
      setSelectedChannelId(nextChannel?.id ?? "");
      setThreadMessageId(null);
    },
    [channels]
  );

  const setChannel = useCallback((channelId: string) => {
    setSelectedChannelId(channelId);
    setThreadMessageId(null);
  }, []);

  const openThread = useCallback((messageId: string) => {
    setThreadMessageId(messageId);
  }, []);

  const closeThread = useCallback(() => {
    setThreadMessageId(null);
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightedMessageId(null);
  }, []);

  const jumpToMessage = useCallback((target: JumpTarget) => {
    setSelectedWorkspaceId(target.workspaceId);
    setSelectedChannelId(target.channelId);
    setThreadMessageId(target.messageId);
    setHighlightedMessageId(target.messageId);
  }, []);

  const value = useMemo(
    () => ({
      workspaces,
      channels,
      allMessages,
      selectedWorkspaceId,
      selectedChannelId,
      threadMessageId,
      highlightedMessageId,
      setWorkspace,
      setChannel,
      openThread,
      closeThread,
      clearHighlight,
      jumpToMessage,
    }),
    [
      workspaces,
      channels,
      allMessages,
      selectedWorkspaceId,
      selectedChannelId,
      threadMessageId,
      highlightedMessageId,
      setWorkspace,
      setChannel,
      openThread,
      closeThread,
      clearHighlight,
      jumpToMessage,
    ]
  );

  return <SlackStoreContext.Provider value={value}>{children}</SlackStoreContext.Provider>;
}

export function useSlackStore() {
  const store = useContext(SlackStoreContext);
  if (!store) {
    throw new Error("useSlackStore must be used within a SlackStoreProvider");
  }
  return store;
}
