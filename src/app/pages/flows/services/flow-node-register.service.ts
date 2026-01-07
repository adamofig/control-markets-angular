import { Injectable, signal, Type } from '@angular/core';
import {
  AgentNodeComponent,
  AudioNodeComponent,
  DistributionChanelNodeComponent,
  OutcomeNodeComponent,
  SourcesNodeComponent,
  TaskNodeComponent,
  EmptyNodeComponent,
  LeadNodeComponent,
} from '../nodes';
import { VideoScriptGenContentComponent } from '../nodes/video-script-gen-node/video-script-gen-content';
import { AssetsNodeComponent } from '../nodes/assets-node/assets-node.component';
import { AssetDetailsComponent } from '../nodes/assets-node/asset-details/asset-details';
import { AudioDetailsComponent } from '../nodes/audio-node/audio-details/audio-details';
import { SourceNodeDetailsComponent } from '../nodes/sources-node/sources-details/source-node-details';
import { AssetGeneratedDetailsComponent } from '../nodes/asset-generated-node/asset-generated-details/asset-generated-details';
import { AudioTTsDetailsComponent } from '../nodes/audio-tts-node/audio-tts-details/audio-tts-details';
import { NodeCategory, NodeCompTypeStr } from '../models/flows.model';
import { WrapperNodeComponent } from '../nodes/wrapper-node/wrapper-node.component';
import { VideoScriptGenDetailsComponent } from '../nodes/video-script-gen-node/video-gen-details/video-script-gen-details';
import { EmptyDetailsComponent } from '../nodes/empty-node/empty-details/empty-details';
import { AudioTTsNodeComponent } from '../nodes/audio-tts-node/audio-tts-node';
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';

export interface INodeConfig {
  component: Type<any>;
  detailsComponent?: Type<any>;
  category: NodeCategory;
  color: string;
  icon?: string;
  label?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlowNodeRegisterService {
  private nodeConfigMap = signal<{ [key in NodeCompTypeStr | string]?: INodeConfig }>({});

  constructor() {
    this.registerNodes();
  }

  private registerNodes(): void {
    this.nodeConfigMap.set({
      [NodeCompTypeStr.AgentNodeComponent]: {
        component: AgentNodeComponent,
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-user-plus',
        label: 'Agent'
      },
      [NodeCompTypeStr.DistributionChanelNodeComponent]: {
        component: DistributionChanelNodeComponent,
        category: NodeCategory.OUTPUT,
        color: '#8b5cf6', // violet-500
        icon: 'pi pi-heart',
        label: 'Distribution'
      },
      [NodeCompTypeStr.OutcomeNodeComponent]: {
        component: OutcomeNodeComponent,
        category: NodeCategory.OUTPUT,
        color: '#3b82f6', // blue-500
        icon: 'pi pi-check-circle',
        label: 'Outcome'
      },
      [NodeCompTypeStr.TaskNodeComponent]: {
        component: TaskNodeComponent,
        category: NodeCategory.PROCESS,
        color: '#f59e0b', // amber-500
        icon: 'pi pi-microchip-ai',
        label: 'Task'
      },
      [NodeCompTypeStr.SourcesNodeComponent]: {
        component: SourcesNodeComponent,
        detailsComponent: SourceNodeDetailsComponent,
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-file-import',
        label: 'Source',
      },
      [NodeCompTypeStr.AssetsNodeComponent]: {
        component: AssetsNodeComponent,
        detailsComponent: AssetDetailsComponent,
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-plus-circle',
        label: 'Asset',
      },
      [NodeCompTypeStr.VideoGenNodeComponent]: {
        component: VideoGenNodeComponent,
        category: NodeCategory.PROCESS,
        color: '#f59e0b', // amber-500
        icon: 'pi pi-video',
        label: 'Video'
      },
      [NodeCompTypeStr.AssetGeneratedNodeComponent]: {
        component: AssetGeneratedNodeComponent,
        detailsComponent: AssetGeneratedDetailsComponent,
        category: NodeCategory.OUTPUT,
        color: '#3b82f6', // blue-500
        icon: 'pi pi-file',
        label: 'Generated Asset',
      },
      [NodeCompTypeStr.AudioTTsNodeComponent]: {
        component: AudioTTsNodeComponent,
        detailsComponent: AudioTTsDetailsComponent,
        category: NodeCategory.PROCESS,
        color: '#f59e0b', // amber-500
        icon: 'pi pi-megaphone',
        label: 'Audio TTS'
      },
      [NodeCompTypeStr.AudioNodeComponent]: {
        component: AudioNodeComponent,
        detailsComponent: AudioDetailsComponent,
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-volume-up',
        label: 'Audio',
      },
      [NodeCompTypeStr.EmptyNodeComponent]: {
        component: EmptyNodeComponent,
        detailsComponent: EmptyDetailsComponent, // 👈 Registered
        category: NodeCategory.PROCESS,
        color: '#6b7280', // gray-500
        icon: 'pi pi-plus',
        label: 'Empty'
      },
      [NodeCompTypeStr.LeadNodeComponent]: {
        component: LeadNodeComponent,
        category: NodeCategory.INPUT,
        color: '#ec4899', // pink-500
        icon: 'pi pi-users',
        label: 'Lead'
      },
      [NodeCompTypeStr.VideoScriptGenNodeComponent]: {
        component: VideoScriptGenContentComponent,
        detailsComponent: VideoScriptGenDetailsComponent, // 👈 Registered
        category: NodeCategory.PROCESS,
        color: '#f59e0b', // amber-500
        icon: 'pi pi-file-edit',
        label: 'Video Script'
      },
      ['WrapperNodeComponent']: {
        component: WrapperNodeComponent,
        category: NodeCategory.PROCESS,
        color: '#6b7280', // gray-500
      },
    });
  }

  public getNodeType(typeString: string): Type<any> | undefined {
    return this.nodeConfigMap()[typeString]?.component;
  }

  public getNodeDetailsType(typeString: string): Type<any> | undefined {
    return this.nodeConfigMap()[typeString]?.detailsComponent;
  }

  public getNodeConfig(typeString: string): INodeConfig | undefined {
    return this.nodeConfigMap()[typeString];
  }

  public getNodeTypeString(type: Type<any>): string | undefined {
    const allConfigs = this.nodeConfigMap();
    for (const key in allConfigs) {
      if (allConfigs[key]?.component === type) {
        return key;
      }
    }
    return undefined;
  }
}
