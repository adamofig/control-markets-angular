import { FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export interface IOrganization {
  _id: string;
  id: string;
  name?: string;
  image?: FileStorageData;
  description?: string;
  guests?: { id: string; name: string; email: string }[];
  type?: string;
  auditable?: IAuditable;
}
