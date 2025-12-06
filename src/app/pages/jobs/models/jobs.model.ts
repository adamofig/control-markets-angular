import { IAgentCardMinimal, ILlmTask, ISourceTask } from '../../tasks/models/tasks-models';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';

export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobRelation {
  id: string;
  name: string;
  description: string;
}

export interface MessageAI {
  role: string;
  content?: string;
}

export interface IAgentOutcomeJob extends AuditDate {
  _id?: string;
  id?: string;
  task: Partial<ILlmTask>; // Relation with the task
  agentCard?: Partial<IAgentCard>; // Relation with the agent card
  messages: MessageAI[]; // Messages of the chat
  response: MessageAI; // Response of the AI
  result: any;
  responseFormat: ResponseFormat; // Format of the response
  sources?: ISourceTask[]; // Relation with sources.
  infoFromSources?: string; // Consolidated information from sources
  inputNodeId?: string;
}

export enum ResponseFormat {
  JSON = 'json', // Json whatever format
  ARRAY = 'array', // Array of objects
  TEXT = 'text', // Text
  DEFAULT_CONTENT = 'default_content', // My default json format {content: string, description: string, tags: string[]}
}
