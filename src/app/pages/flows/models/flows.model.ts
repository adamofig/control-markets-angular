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
