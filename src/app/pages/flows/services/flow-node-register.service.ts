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
import { NodeCompTypeStr } from '../models/flows.model';
import { WrapperNodeComponent } from '../nodes/wrapper-node/wrapper-node.component';

@Injectable({
  providedIn: 'root',
})
export class FlowNodeRegisterService {
  private nodeTypeMap = signal<{ [key in NodeCompTypeStr | string]?: Type<any> }>({});

  constructor() {
    this.registerNodes();
  }

  private registerNodes(): void {
    this.nodeTypeMap.set({
      [NodeCompTypeStr.AgentNodeComponent]: AgentNodeComponent,
      [NodeCompTypeStr.DistributionChanelNodeComponent]: DistributionChanelNodeComponent,
      [NodeCompTypeStr.OutcomeNodeComponent]: OutcomeNodeComponent,
      [NodeCompTypeStr.TaskNodeComponent]: TaskNodeComponent,
      [NodeCompTypeStr.SourcesNodeComponent]: SourcesNodeComponent,
      [NodeCompTypeStr.AssetsNodeComponent]: AssetsNodeComponent,
      [NodeCompTypeStr.VideoGenNodeComponent]: VideoGenNodeComponent,
      [NodeCompTypeStr.AssetGeneratedNodeComponent]: AssetGeneratedNodeComponent,
      [NodeCompTypeStr.AudioTTsNodeComponent]: AudioTTsNodeComponent,
      [NodeCompTypeStr.AudioNodeComponent]: AudioNodeComponent,
      [NodeCompTypeStr.EmptyNodeComponent]: EmptyNodeComponent,
      [NodeCompTypeStr.LeadNodeComponent]: LeadNodeComponent,
      [NodeCompTypeStr.VideoScriptGenNodeComponent]: VideoScriptGenContentComponent,
      ['WrapperNodeComponent']: WrapperNodeComponent,
    });
  }

  public getNodeType(typeString: string): Type<any> | undefined {
    const allNodes = this.nodeTypeMap();
    return allNodes[typeString];
  }

  public getNodeTypeString(type: Type<any>): string | undefined {
    const allNodes = this.nodeTypeMap();
    for (const key in allNodes) {
      if (allNodes[key as NodeCompTypeStr] === type) {
        return key;
      }
    }
    return undefined;
  }
}
