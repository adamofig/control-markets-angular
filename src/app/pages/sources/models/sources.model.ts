import { Caption, TikTokPage } from '@remotion/captions';

export interface AuditDate {
  createdAt: string;
  updatedAt: string;
}

export enum SourceType {
  DOCUMENT = 'document',
  WEBSITE = 'website',
  YOUTUBE = 'youtube',
  NOTION = 'notion',
  TIKTOK = 'tiktok',
}

export interface CloudStorageData {
  bucket?: string;
  url?: string;
  path?: string; // path where the file is in the storage
}

export interface IImageSource {
  image: CloudStorageData;
  description: string;
  title: string;
}

export interface IAudioSource {
  audio: CloudStorageData;
  transcription: string;
  description: string;
}

export interface WhisperTranscription {
  text: string;
  duration: number;
  segments: any[];
  words: any[];
  language: string;
}

export interface IVideoSource {
  id_platform: string;
  audio: CloudStorageData;
  separatedAudio?: { vocals?: CloudStorageData; no_vocals?: CloudStorageData };
  video: CloudStorageData;
  frames: IImageSource[];
  transcription?: WhisperTranscription;
  // remotionCaptions?: Caption[];
  captions?: {
    remotion?: Caption[];
    tiktokStyle?: TikTokPage[];
    tiktokStyleSpanish?: TikTokPage[];
  };
  description: string;
}
export interface IAgentSource extends AuditDate {
  _id?: string;
  id: string;
  name: string;
  description: string;
  type: SourceType;
  sourceUrl: string;
  content: string;
  contentEnhancedAI?: string;
  image: IImageSource;
  video: IVideoSource;
  assets?: Record<string, CloudStorageData>;
  thumbnail: CloudStorageData;
  status: string;
  statusDescription: string;
  relationId?: string;
}

export const SourceTypeOptions = [
  { label: 'Document', value: SourceType.DOCUMENT },
  { label: 'Website', value: SourceType.WEBSITE },
  { label: 'Youtube', value: SourceType.YOUTUBE },
  { label: 'Notion', value: SourceType.NOTION },
  { label: 'Tiktok', value: SourceType.TIKTOK },
];
