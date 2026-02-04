import { channels, dmMessages, dms, messages, workspaces } from "@/data/mockData";
import { Channel, DM, DMMessage, Message, Workspace } from "@/types/slack";

export type SlackDataService = {
  getWorkspaces: () => Promise<Workspace[]>;
  getChannels: (workspaceId: string) => Promise<Channel[]>;
  getMessages: (channelId: string) => Promise<Message[]>;
  getDMs: (workspaceId: string) => Promise<DM[]>;
  getDMMessages: (dmId: string) => Promise<DMMessage[]>;
  getAllMessages: () => Promise<Message[]>;
};

class MockSlackDataService implements SlackDataService {
  async getWorkspaces(): Promise<Workspace[]> {
    return workspaces;
  }

  async getChannels(workspaceId: string): Promise<Channel[]> {
    return channels.filter((channel) => channel.workspaceId === workspaceId);
  }

  async getMessages(channelId: string): Promise<Message[]> {
    return messages.filter((message) => message.channelId === channelId);
  }

  async getDMs(workspaceId: string): Promise<DM[]> {
    return dms.filter((dm) => dm.workspaceId === workspaceId);
  }

  async getDMMessages(dmId: string): Promise<DMMessage[]> {
    return dmMessages.filter((message) => message.dmId === dmId);
  }

  async getAllMessages(): Promise<Message[]> {
    return messages;
  }
}

// Swap this out with a real API implementation later.
export const slackService: SlackDataService = new MockSlackDataService();
