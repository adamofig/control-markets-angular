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
  inputEntityId: string;
  nodeType: NodeType;

  status: StatusJob;
  messages: MessageLog[];
  outputEntityId: string;
  resultType: 'outcome' | 'generatedAsset' | '';

  // inputType: NodeType;
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

export enum NodeType {
  AgentNodeComponent = 'AgentNodeComponent',
  TaskNodeComponent = 'TaskNodeComponent',
  SourcesNodeComponent = 'SourcesNodeComponent',
  OutcomeNodeComponent = 'OutcomeNodeComponent',
  default = 'default',
}

export interface ITaskExecutionStateV2 {
  id: string; // Creo que no tengo los ids
  nodeId: string;
  taskId: string;
  status: StatusJob;
  jobs: Array<IJobExecutionState>;
}
export interface IFlowExecutionStateV2 {
  executionId: string; // flow execution id
  flowId: string; // flow id
  status: StatusJob;
  tasks: Array<ITaskExecutionStateV2>;
}
