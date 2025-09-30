export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export enum NodeCategory {
  INPUT = 'input',
  PROCESS = 'process',
  OUTPUT = 'output',
}

export interface IAgentFlowsMetadata {
  totalNodes?: number;
  totalEdges?: number;
  inputNodes?: number;
  outputNodes?: number;
  processNodes?: number;
  urlImages?: string[];
}

export interface IEdgesData {
  id: string;
  source: string;
  target: string;
  markets?: string[];
  edgeLabels?: string[];
}

export interface INodeData {
  id: string;
  point: { x: number; y: number };
  type: string; // not string but is the serialization of the class, use component to rely on the component.
  category: NodeCategory;
  component: NodeType;
  data: any;
}
export interface IAgentFlows extends AuditDate {
  _id?: string;
  id: string;
  name?: string;
  nodes?: INodeData[];
  edges?: IEdgesData[];
  metadata?: IAgentFlowsMetadata;
}

export interface MessageLog {
  id?: string;
  text?: string;
  details?: string;
  createdAt?: Date;
}

export enum StatusJob {
  DEFAULT = 'default',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum NodeType {
  AgentNodeComponent = 'AgentNodeComponent',
  TaskNodeComponent = 'TaskNodeComponent',
  SourcesNodeComponent = 'SourcesNodeComponent',
  OutcomeNodeComponent = 'OutcomeNodeComponent',
  DistributionChanelNodeComponent = 'DistributionChanelNodeComponent',
  AssetGeneratedNodeComponent = 'AssetGeneratedNodeComponent',
  AssetsNodeComponent = 'AssetsNodeComponent',
  VideoGenNodeComponent = 'VideoGenNodeComponent',
  AudioTTsNodeComponent = 'AudioTTsNodeComponent',
  default = 'default',
}

export interface IJobExecutionState {
  inputNodeId: string; // en el FlowDiagram es el Node Id a que nodo se tomó para ser input.
  processNodeId: string; // en el FlowDiagram es el Node Id a que nodo se tomó para ser el proceso tarea.
  outputNodeId: string; // en el FlowDiagram es el Node Id a que nodo debe actualizar con el output.
  nodeType: NodeType; // El tipo de Nodo en Angular, la clase del componente.
  inputEntityId: string; // el id del objeto entity, es decir existe en mongo. y lo puedo consultar, se infiere por el tipo de nodo. que collection o table existe el dato.
  status: StatusJob; // El estado del job.
  statusDescription: string;
  messages: MessageLog[]; // Los mensajes del job. solo para job que requiera LLM.
  outputEntityId: string; // el id del objeto entity, es decir existe en mongo. y lo puedo consultar.
  resultType: 'outcome' | 'generatedAsset' | ''; // Para saber en que base buscar. directo podría ser collection_output_name o table.
  fatherTaskId: string; // Para mantener la relación ya que un Execution Flow tiene task que tiene jobs.
  flowExecutionId: string; // el id que le doy a firebase, debería ser igual que el de mongo. TODO: ver si puedo forzar esto.
}

export interface ITaskExecutionState {
  id: string; // Supongo que es el id de la execucion
  flowExecutionId: string; // El id de la ejecucion del flow.
  processNodeId: string; // El id del Node que es de tipo process.
  entityId: string; // if data exits in db, use nodeType to know what database.
  nodeType: NodeType;
  status: StatusJob;
  jobs: Array<IJobExecutionState>;
}

export interface IFlowExecutionState {
  id: string; // El id que le da firebase
  flowExecutionId: string; // flow execution id es solo otro id extra que le genero en código, quizá no lo use.
  flowId: string; // flow id
  status: StatusJob;
  tasks: Array<ITaskExecutionState>;
}
