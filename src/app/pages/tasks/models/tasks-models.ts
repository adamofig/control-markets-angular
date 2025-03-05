import { IAgentCard } from '@dataclouder/conversation-system';

export interface ISourceTask {
  id: string;
  name: string;
  type: string;
}

export type IAgentCardMinimal = Pick<IAgentCard, 'id' | 'assets'>;

export interface IAgentTask {
  _id?: string;
  id: string;
  name: string;
  description: string;
  agentCards: Partial<IAgentCard>[];
  status: string;

  taskType: AgentTaskType;
  taskAttached: Partial<IAgentTask>;

  sources: ISourceTask[];
  output: ITaskOutput;
  model: IAIModel;

  // Deprecated
  notionOutput: { id: string; name: string; type: string };
}

export interface IAIModel {
  id: string;
  provider: string;
  modelName: string;
}

export interface ITaskOutput {
  id?: string;
  type?: string;
  name?: string;
}

export enum AgentTaskStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
}
export const AgentTaskStatusOptions = [
  { label: 'Activo', value: AgentTaskStatus.ACTIVE },
  { label: 'En pausa', value: AgentTaskStatus.PAUSED },
];

export enum AgentTaskType {
  REVIEW_TASK = 'review_task',
  CREATE_CONTENT = 'create_content',
}

export const AgentTaskOptions = [
  { label: 'Revisar tarea', value: AgentTaskType.REVIEW_TASK },
  { label: 'Crear contenido', value: AgentTaskType.CREATE_CONTENT },
];

export interface IAgentJob {
  _id?: string;
  id?: string;
  idTask: string;
  idAgentCard: string;
  messages: any[];
  response: any;
}
