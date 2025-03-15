import { IAgentSource } from '../../sources/models/sources.model';

export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

// export interface IVideoProjectGeneratorRelation {
//   id: string;
//   name: string;
//   description: string;
//   reference?: IAgentSource;
// }

export interface IVideoProjectGenerator extends AuditDate {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  sources?: any[];
  compositionPlan?: { overlays: IOverlayPlan[] };
}

export interface IFragmentExtraction {
  start: number | null;
  end: number | null;
  reason: string;
  suggestions: string;
  instructions: string;
  duration: number;
  // Ideas for futute
  // priority?: number; // For AI ordering logic
  // tags?: string[]; // For categorization
  // transcript?: string; // Text content of the fragment
  // sentiment?: string; // Emotional tone
}

//definition for AI to understand the fragment extraction
export const BEST_FRAGMENT_DEFINITION = `
interface IFragmentExtraction {
  start: string;                      // Second where the video should start
  end: string;                        // Second where the video should end
  reason: string;                     // Reason why you choose this part
  suggestions: string;                // Any suggestions for visual elements or effects to enhance the segment
}`;

export interface IOverlayPlan {
  type: 'video';
  sourceId: string; // related to the source to get data.
  timelineStart: number | null;
  timelineEnd: number | null;
  fragment: IFragmentExtraction;
  // Idaeas for future
  // properties: any; // potencially css effects and more.
  // transitionIn?: string; // Transition effect entering this fragment
  // transitionOut?: string; // Transition effect leaving this fragment
  // zIndex?: number; // For layering elements
  // opacity?: number; // For visual effects
  // volume?: number; // For audio control
}
