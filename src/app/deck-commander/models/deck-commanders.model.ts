import { CloudStorageData } from '@dataclouder/ngx-cloud-storage';

export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export enum DeckCommanderType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface IDeckCommanderRelation {
  id: string;
  name: string;
  description: string;
}

export interface IDeckCommander extends AuditDate {
  _id: string;
  id: string;
  name?: string;
  image?: CloudStorageData;
  description?: string;
  type?: string;
  relation?: IDeckCommanderRelation;
}
