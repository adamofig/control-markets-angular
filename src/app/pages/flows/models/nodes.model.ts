import { FileStorageData } from '@dataclouder/ngx-cloud-storage';

export interface IAssetNodeData {
  _id?: string;
  id: string;
  name: string;
  type: string;
  storage: FileStorageData;
}

export interface INodeVideoGenerationData {
  _id?: string;
  id: string;
  prompt: string;
}
