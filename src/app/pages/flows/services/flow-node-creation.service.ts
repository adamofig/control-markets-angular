import { Injectable, signal, inject, NgZone, Type } from '@angular/core';
import { IJobExecutionState, NodeType } from '../models/flows.model';
import { DynamicNodeWithData, FlowDiagramStateService } from './flow-diagram-state.service';
import { IGeneratedAsset, GeneratedAssetsService } from '@dataclouder/ngx-ai-services';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';
import { nanoid } from 'nanoid';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';
import { AudioTTsNodeComponent } from '../nodes/audio-tts-node/audio-tts-node';

@Injectable({
  providedIn: 'root',
})
export class FlowNodeCreationService {
  private generatedAssetsService = inject(GeneratedAssetsService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  private flowDiagramStateService = inject(FlowDiagramStateService);

  public async addGeneratedAssetNodeToFlow(jobExecutionState: IJobExecutionState) {
    const generatedAsset = await this.generatedAssetsService.findOne(jobExecutionState.outputEntityId);
    console.log('generatedAsset', generatedAsset);
    if (jobExecutionState) {
      if (jobExecutionState.outputNodeId) {
        // alert('Debería conectar con el nodo que ya tengo');
      } else {
        // alert('Debería crear un nuevo nodo');
      }
      // Por ahora siempre agregar el nodo.

      this.addAssetGeneratedNode(generatedAsset, jobExecutionState.inputNodeId, jobExecutionState.processNodeId);
    }
  }

  public addAssetGeneratedNode(generatedAsset: IGeneratedAsset, inputNodeId: string, processNodeId: string) {
    const inputNode = this.flowSignalNodeStateService.nodes().find(node => node?.id === inputNodeId);
    const processNode = this.flowSignalNodeStateService.nodes().find(node => node?.id === processNodeId);
    const x = processNode?.point().x! + (processNode?.point().x! - inputNode?.point().x!);
    const y = processNode?.point().y! + (processNode?.point().y! - inputNode?.point().y!);

    const newNode: DynamicNodeWithData = {
      id: 'asset-generated-node-' + nanoid(),
      point: signal({ x: x, y: y }), // Default position
      type: AssetGeneratedNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      category: 'output',
      data: { nodeData: generatedAsset },
      component: 'AssetGeneratedNodeComponent',
    };
    this.flowSignalNodeStateService.nodes.set([...this.flowSignalNodeStateService.nodes(), newNode]);
  }

  public addAudioTTSNode() {
    this.flowDiagramStateService.vflowComponent.panTo({ x: 100, y: 100 });
    // this.flowDiagramStateService.vflowComponent.zoomTo(1);
    const newNode: DynamicNodeWithData = {
      id: 'audio-tts-gen-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: AudioTTsNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      category: 'process',
      component: NodeType.AudioTTsNodeComponent,
    };
    this.flowSignalNodeStateService.nodes.set([...this.flowSignalNodeStateService.nodes(), newNode]);
  }
}
