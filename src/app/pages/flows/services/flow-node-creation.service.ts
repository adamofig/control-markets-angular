import { Injectable, signal, inject, NgZone, Type } from '@angular/core';
import { IFlowExecutionState, StatusJob, IJobExecutionState, ITaskExecutionState, IFlowExecutionStateV2, ITaskExecutionStateV2 } from '../models/flows.model';
import { DynamicNodeWithData, FlowDiagramStateService } from './flow-diagram-state.service';
import { GeneratedAsset, GeneratedAssetsService } from '@dataclouder/ngx-vertex';
import { nanoid } from 'nanoid';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';

@Injectable({
  providedIn: 'root',
})
export class FlowNodeCreationService {
  private generatedAssetsService = inject(GeneratedAssetsService);
  private flowDiagramStateService = inject(FlowDiagramStateService);

  public async addGeneratedAssetNodeToFlow(jobExecutionState: IJobExecutionState) {
    const generatedAsset = await this.generatedAssetsService.findOne(jobExecutionState.outputEntityId);
    console.log('generatedAsset', generatedAsset);
    this.addAssetGeneratedNode(generatedAsset);
  }

  public addAssetGeneratedNode(generatedAsset: GeneratedAsset) {
    const newNode: DynamicNodeWithData = {
      id: 'asset-generated-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: AssetGeneratedNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      category: 'output',
      data: { nodeData: generatedAsset },
    };
    this.flowDiagramStateService.nodes.set([...this.flowDiagramStateService.nodes(), newNode]);
  }
}
