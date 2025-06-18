export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export interface IAgentFlows extends AuditDate {
  id: string;
  name?: string;
  nodes?: any[];
  edges?: any[];
}
