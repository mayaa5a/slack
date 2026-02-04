import {
  ActionItem,
  DashboardSummary,
  Message,
  PriorityItem,
  Workspace,
  WorkspaceSummary,
} from "@/types/slack";

const trimSentence = (text: string, maxLength = 88): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}…`;
};

const scoreMessage = (message: Message): number => {
  let score = 0;
  if (message.requiresAction) {
    score += 5;
  }
  if (message.mentionedMe) {
    score += 4;
  }
  if (message.unread) {
    score += 2;
  }
  return score;
};

export const summarizeMissedMessages = (
  allMessages: Message[],
  allWorkspaces: Workspace[]
): DashboardSummary => {
  const relevant = allMessages.filter(
    (message) => message.unread || message.mentionedMe || message.requiresAction
  );

  const topMessages = [...relevant]
    .sort((a, b) => scoreMessage(b) - scoreMessage(a))
    .slice(0, 5);

  const priorities: PriorityItem[] = topMessages.map((message) => ({
    id: `p-${message.id}`,
    title: trimSentence(message.text, 74),
    reason: message.requiresAction
      ? "Action required"
      : message.mentionedMe
        ? "Direct mention"
        : "Unread update",
    source: {
      workspaceId: message.workspaceId,
      channelId: message.channelId,
      messageId: message.id,
    },
  }));

  const unreadCount = relevant.filter((message) => message.unread).length;
  const mentionCount = relevant.filter((message) => message.mentionedMe).length;
  const actionCount = relevant.filter((message) => message.requiresAction).length;

  const whatYouMissed = [
    `${unreadCount} unread messages across ${allWorkspaces.length} workspaces.`,
    `${mentionCount} direct mentions that likely need your response.`,
    `${actionCount} messages flagged as action-required.`,
  ];

  const workspaceSummaries: WorkspaceSummary[] = allWorkspaces.map((workspace) => {
    const workspaceMessages = relevant.filter((message) => message.workspaceId === workspace.id);
    const workspacePriorities = [...workspaceMessages]
      .sort((a, b) => scoreMessage(b) - scoreMessage(a))
      .slice(0, 2)
      .map((message) => ({
        id: `ws-${workspace.id}-${message.id}`,
        title: trimSentence(message.text, 68),
        reason: message.requiresAction ? "Needs action" : "Context update",
        source: {
          workspaceId: message.workspaceId,
          channelId: message.channelId,
          messageId: message.id,
        },
      }));

    const summary = workspaceMessages.length
      ? `${workspaceMessages.length} key updates, with ${workspaceMessages.filter((message) => message.requiresAction).length} requiring follow-up.`
      : "No urgent updates right now.";

    return {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      summary,
      highlights: workspacePriorities,
    };
  });

  const actionItems: ActionItem[] = relevant
    .filter((message) => message.requiresAction)
    .slice(0, 6)
    .map((message) => ({
      id: `a-${message.id}`,
      text: trimSentence(message.text, 72),
      source: {
        workspaceId: message.workspaceId,
        channelId: message.channelId,
        messageId: message.id,
      },
    }));

  return {
    whatYouMissed,
    priorities,
    workspaces: workspaceSummaries,
    actionItems,
  };
};
