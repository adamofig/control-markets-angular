import { CloudStorage } from '@dataclouder/ngx-cloud-storage';
import { IAgentSource } from '../../sources/models/sources.model';
import { ILlmTask } from '../../tasks/models/tasks-models';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';

export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export interface SourceWithReference {
  id: string;
  name: string;
  description: string;
  reference?: IAgentSource;
  thumbnail?: CloudStorage;
}

export interface AgentCardWithReference {
  id: string;
  title: string;
  reference?: IAgentCard;
  assets?: Record<string, CloudStorage>;
}

export interface ICompositionPlan {
  overlays: IOverlayPlan[];
}

export interface IDialog {
  content: string;
  audio: CloudStorage;
  voice: string;
  transcription: any; // TODO: Define transcription type whisper
  captions: any; // TODO: Define captions type whisper
}

export interface IVideoProjectGenerator extends AuditDate {
  _id?: string;
  id: string;
  name?: string;
  description?: string;
  type?: string;
  sources?: SourceWithReference[];
  dialogs?: IDialog[];
  // Having one is temporary in the future probably will migrate to array.
  agent?: Partial<AgentCardWithReference>;
  task?: Partial<ILlmTask>;
  compositionPlan?: ICompositionPlan;
}

export interface IFragmentExtraction {
  startSec: number | null;
  endSec: number | null;
  reason?: string;
  suggestions?: string;
  instructions?: string;
  durationSec?: number;
  // Ideas for futute
  // priority?: number; // For AI ordering logic
  // tags?: string[]; // For categorization
  // transcript?: string; // Text content of the fragment
  // sentiment?: string; // Emotional tone
}

//definition for AI to understand the fragment extraction
export const BEST_FRAGMENT_DEFINITION = `
interface IFragmentExtraction {
  startSec: string;                      // Second where the video should start
  endSec: string;                        // Second where the video should end
  reason: string;                     // Reason why you choose this part
  suggestions: string;                // Any suggestions for visual elements or effects to enhance the segment
}`;

export interface IOverlayPlan {
  type: 'video';
  sourceId: string; // related to the source to get data.
  timelineStartSec: number | null;
  timelineEndSec: number | null;
  fragment: IFragmentExtraction;
  fragments: IFragmentExtraction[];
  // Idaeas for future
  // properties: any; // potencially css effects and more.
  // transitionIn?: string; // Transition effect entering this fragment
  // transitionOut?: string; // Transition effect leaving this fragment
  // zIndex?: number; // For layering elements
  // opacity?: number; // For visual effects
  // volume?: number; // For audio control
}
