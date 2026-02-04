export type Workspace = {
  id: string;
  name: string;
  unreadCount: number;
};

export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  unreadCount: number;
};

export type ThreadReply = {
  id: string;
  user: string;
  text: string;
  ts: string;
};

export type Message = {
  id: string;
  workspaceId: string;
  channelId: string;
  user: string;
  text: string;
  ts: string;
  unread: boolean;
  mentionedMe: boolean;
  requiresAction: boolean;
  thread?: ThreadReply[];
};

export type DM = {
  id: string;
  workspaceId: string;
  name: string;
  unreadCount: number;
};

export type DMMessage = {
  id: string;
  workspaceId: string;
  dmId: string;
  user: string;
  text: string;
  ts: string;
  unread: boolean;
  mentionedMe: boolean;
  requiresAction: boolean;
};

export type MessageSource = {
  workspaceId: string;
  channelId: string;
  messageId: string;
};

export type PriorityItem = {
  id: string;
  title: string;
  reason: string;
  source: MessageSource;
};

export type WorkspaceSummary = {
  workspaceId: string;
  workspaceName: string;
  summary: string;
  highlights: PriorityItem[];
};

export type ActionItem = {
  id: string;
  text: string;
  source: MessageSource;
};

export type DashboardSummary = {
  whatYouMissed: string[];
  priorities: PriorityItem[];
  workspaces: WorkspaceSummary[];
  actionItems: ActionItem[];
};
