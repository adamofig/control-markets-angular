import { FileStorageData } from '@dataclouder/ngx-cloud-storage';

export interface IAssetNodeData {
  _id?: string;
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  storage: FileStorageData;
}

export interface INodeVideoGenerationData {
  _id?: string;
  id: string;
  prompt: string;
  request?: any;
  provider: 'veo' | 'comfy';
}
