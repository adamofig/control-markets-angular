import { FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export enum OrganizationType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface IOrganizationRelation {
  id: string;
  name: string;
  description: string;
}

export interface IOrganization {
  _id: string;
  id: string;
  name?: string;
  image?: FileStorageData;
  description?: string;
  guests?: { id: string; name: string; email: string }[];
  type?: string;
  relation?: IOrganizationRelation;
  auditable?: IAuditable;
}
