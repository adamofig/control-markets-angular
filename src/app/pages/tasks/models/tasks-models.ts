import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { FileStorageData } from '@dataclouder/ngx-cloud-storage';

export interface ISourceTask {
  id: string;
  name: string;
  type: string;
}

export type IAgentCardMinimal = Pick<IAgentCard, 'id' | 'assets'>;

// TODO: i want to refactor this to LLMTask since is always one call to the LLM.
export interface ILlmTask {
  _id?: string;
  id: string;
  name: string; // This is the name of the task
  description: string; // This is a summary of the task
  prompt: string; // This is the task for the LLM

  agentCards: Partial<IAgentCard>[];
  status: string;

  image: any; // Next Version will Have assetable. instead of image.

  taskType: AgentTaskType;
  taskAttached: Partial<ILlmTask>;
  sources: ISourceTask[]; // Optional, since the sources i got them now from flow. this works undertsanding the llm taks will execute outside the flow.
  output: ITaskOutput;
  model: IAIModel;

  // Deprecated but may be i create new output Location i move notion to there so i can expand this feature.
  notionOutput: { id: string; name: string; type: string };
}

export interface IAIModel {
  id: string;
  provider: string;
  modelName: string;
  quality: string;
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
  TEXT_RESPONSE = 'text_response',
}

// son clasificaciones para el tipo de tarea a realizar, voy a mejorar en el futuro.
export const AgentTaskOptions = [
  { label: 'Revisar tarea', value: AgentTaskType.REVIEW_TASK },
  { label: 'Crear contenido', value: AgentTaskType.CREATE_CONTENT },
  { label: 'Respuesta en Texto', value: AgentTaskType.TEXT_RESPONSE },
];

// Es para parsear el contenido y garantizar que se obtiene el formato requerido, JSON es lo mas importante pero en el futuro quiza Yaml
// Markdown no es como tal un formato porque sigue siendo el texto normal.
export const LlmOutputFormatOptions = [
  { label: 'Default', value: 'default' },
  { label: 'JSON', value: 'json' },
];

// export interface IAgentOutcomeJob {
//   _id?: string;
//   id?: string;
//   idTask: string;
//   idAgentCard: string;
//   messages: any[];
//   response: any;
// }
