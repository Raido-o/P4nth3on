export type GreatPerson = {
  id: string;
  name: string;
  nameJa: string;
  era: string;
  field: string;
  description: string;
  avatarColor: string;
  avatarInitial: string;
  imagePath: string;
  systemPrompt: string;
};

export type Message = {
  id: string;
  agentId: string;
  agentName: string;
  agentNameJa: string;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
};

export type DiscussionState =
  | "idle"
  | "topic_set"
  | "discussing"
  | "stopped";
