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
import { AssetsNodeComponent } from '../nodes/assets-node/assets-node.component';
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';
import { AudioTTsNodeComponent } from '../nodes/audio-tts-node/audio-tts-node';
import { NodeTypeStr } from '../models/flows.model';

@Injectable({
  providedIn: 'root',
})
export class FlowNodeRegisterService {
  private nodeTypeMap = signal<{ [key in NodeTypeStr]?: Type<any> }>({});

  constructor() {
    this.registerNodes();
  }

  private registerNodes(): void {
    this.nodeTypeMap.set({
      [NodeTypeStr.AgentNodeComponent]: AgentNodeComponent,
      [NodeTypeStr.DistributionChanelNodeComponent]: DistributionChanelNodeComponent,
      [NodeTypeStr.OutcomeNodeComponent]: OutcomeNodeComponent,
      [NodeTypeStr.TaskNodeComponent]: TaskNodeComponent,
      [NodeTypeStr.SourcesNodeComponent]: SourcesNodeComponent,
      [NodeTypeStr.AssetsNodeComponent]: AssetsNodeComponent,
      [NodeTypeStr.VideoGenNodeComponent]: VideoGenNodeComponent,
      [NodeTypeStr.AssetGeneratedNodeComponent]: AssetGeneratedNodeComponent,
      [NodeTypeStr.AudioTTsNodeComponent]: AudioTTsNodeComponent,
      [NodeTypeStr.AudioNodeComponent]: AudioNodeComponent,
      [NodeTypeStr.EmptyNodeComponent]: EmptyNodeComponent,
      [NodeTypeStr.LeadNodeComponent]: LeadNodeComponent,
    });
  }

  public getNodeType(typeString: string): Type<any> | undefined {
    const allNodes = this.nodeTypeMap();
    return allNodes[typeString as NodeTypeStr];
  }

  public getNodeTypeString(type: Type<any>): string | undefined {
    const allNodes = this.nodeTypeMap();
    for (const key in allNodes) {
      if (allNodes[key as NodeTypeStr] === type) {
        return key;
      }
    }
    return undefined;
  }
}
