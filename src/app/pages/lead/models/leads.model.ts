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
  conversationAnalysis?: IConversationAnalysis;
  messages?: IMessage[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PhoneNumberData {
  country_code?: string;
  area_code?: string;
  country?: string;
  state?: string | null;
  municipality?: string | null;
  full_number?: string;
  // Keep camelCase for backward compatibility if needed, or remove if strictly following new JSON
  countryCode?: string;
  areaCode?: string;
  fullNumber?: string;
}

export interface IMessage {
  createdAt: number;
  role: 'user' | 'assistant';
  content: string | null;
  attachments?: any[];
}

export interface IConversationAnalysis {
  statistics: {
    leadResponseTime: {
      averageMinutes: number | null;
      fastestMinutes: number | null;
      slowestMinutes: number | null;
    };
  };
  metrics: {
    leadQuestionsCount: number;
    assistantQuestionsCount: number;
    questionsRatio: number;
    leadMessagesCount: number;
    assistantMessagesCount: number;
    messagesRatio: number;
  };
  languageInterests: any[];
  barriers: {
    objections: any[];
    concerns: any[];
    doubts: any[];
  };
  featuresShown: {
    flashcards: boolean;
    lessons: boolean;
    conversations: boolean;
    mobileApp: boolean;
  };
  keyQuestions: {
    askedAboutPrice: boolean;
    askedAboutTrial: boolean;
  };
  microConversions: {
    downloadedApp: boolean;
    watchedVideos: boolean;
    openedLinks: boolean;
  };
  behavioralSignals: {
    proactiveActions: string[];
    hesitationPoints: string[];
    buyingSignals: string[];
  };
  funnelStage: string;
  purchaseProbability: string;
  insights: {
    opinion: string;
    recommendations: string;
    nextSteps: string[];
  };
}
