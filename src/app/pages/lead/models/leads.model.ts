import { FileStorageData, IAssetable } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export enum LeadType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface ILeadRelation {
  id: string;
  name: string;
  description: string;
}

export interface ILead {
  _id: string;
  id: string;
  name?: string;
  image?: FileStorageData;
  description?: string;
  type?: string;
  relation?: ILeadRelation;
  auditable?: IAuditable;
  assets: IAssetable;
  phoneNumber?: string;
  phoneNumberData?: PhoneNumberData;
}

export interface PhoneNumberData {
  countryCode: string;
  areaCode: string;
  country: string;
  state: string;
  municipality: string;
  fullNumber: string;
}
