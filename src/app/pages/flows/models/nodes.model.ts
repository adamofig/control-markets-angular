import { FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { TranscriptionsWhisper } from '@dataclouder/ngx-ai-services';
import { IDialog } from '../../video-projects-gen/models/video-project.model';

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

export interface IAudioAssetsNodeData extends IAssetNodeData {
  transcription?: TranscriptionsWhisper;
}

export interface ILeadNodeData {
  id: string;
  name: string;
  phone_no: string;
  nationality: string;
}

export interface ILeadNode {
  name: string;
  number: string;
  nationality: string;
}

export interface IVideoScriptGenNodeData {
  _id?: string;
  id: string;
  prompt: string;
  script?: string;
  dialogs?: IDialog[];
  request?: any;
}

export interface IEmptyNodeData {
  name: string;
  description: string;
}
