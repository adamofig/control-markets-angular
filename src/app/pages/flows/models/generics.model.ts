import { CloudStorageData } from '@dataclouder/ngx-cloud-storage';

export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export interface IGenericRelation {
  id: string;
  name: string;
  description: string;
}

export interface IFlow extends AuditDate {
  id: string;
  name?: string;
  nodes?: any[];
  edges?: any[];
}
