import { CloudStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAgentCardMinimal, IAgentTask, ISourceTask } from '../../tasks/models/tasks-models';
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
  content: string;
}

export interface IAgentJob extends AuditDate {
  _id?: string;
  id?: string;
  task: Partial<IAgentTask>; // Relation with the task
  agentCard?: Partial<IAgentCard>; // Relation with the agent card
  messages: MessageAI[]; // Messages of the chat
  response: MessageAI; // Response of the AI
  responseFormat: string; // Format of the response
  sources?: ISourceTask[]; // Relation with sources.
  infoFromSources?: string; // Consolidated information from sources
}
