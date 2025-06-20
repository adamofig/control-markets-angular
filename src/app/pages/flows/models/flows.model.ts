export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export interface IAgentFlows extends AuditDate {
  _id?: string;
  id: string;
  name?: string;
  nodes?: any[];
  edges?: any[];
}

export interface MessageLog {
  id?: string;
  text?: string;
  details?: string;
  createdAt?: Date;
}

export enum StatusJob {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IJobExecutionState {
  nodeId: string;
  agentCardId: string;
  status: StatusJob;
  messages: MessageLog[];
  outcomeId: string;
}

export interface ITaskExecutionState {
  nodeId: string;
  taskId: string;
  status: StatusJob;
  jobs: Record<string, IJobExecutionState>;
}

export interface IFlowExecutionState {
  id: string; // flow execution id
  flowId: string; // flow id
  status: StatusJob;
  tasks: Record<string, ITaskExecutionState>;
}
