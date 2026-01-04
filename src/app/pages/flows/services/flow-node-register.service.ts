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
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';
import { AudioTTsNodeComponent } from '../nodes/audio-tts-node/audio-tts-node';
import { NodeCategory, NodeCompTypeStr } from '../models/flows.model';
import { WrapperNodeComponent } from '../nodes/wrapper-node/wrapper-node.component';
import { VideoScriptGenDetailsComponent } from '../nodes/video-script-gen-node/video-gen-details/video-script-gen-details';
import { EmptyDetailsComponent } from '../nodes/empty-node/empty-details/empty-details';

export interface INodeConfig {
  component: Type<any>;
  detailsComponent?: Type<any>; // 👈 Added
  category: NodeCategory; // 👈 Added
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
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-file-import',
        label: 'Source'
      },
      [NodeCompTypeStr.AssetsNodeComponent]: {
        component: AssetsNodeComponent,
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-plus-circle',
        label: 'Asset'
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
        category: NodeCategory.OUTPUT,
        color: '#3b82f6', // blue-500
        icon: 'pi pi-file',
        label: 'Generated Asset'
      },
      [NodeCompTypeStr.AudioTTsNodeComponent]: {
        component: AudioTTsNodeComponent,
        category: NodeCategory.PROCESS,
        color: '#f59e0b', // amber-500
        icon: 'pi pi-megaphone',
        label: 'Audio TTS'
      },
      [NodeCompTypeStr.AudioNodeComponent]: {
        component: AudioNodeComponent,
        category: NodeCategory.INPUT,
        color: '#10b981', // green-500
        icon: 'pi pi-volume-up',
        label: 'Audio'
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
