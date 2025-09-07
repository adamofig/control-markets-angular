import { Component, computed, inject, OnInit } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { IAssetNodeData } from 'src/app/pages/tasks/models/tasks-models';
import { IFlowExecutionStateV2, StatusJob } from '../../models/flows.model';
import { FlowExecutionStateService } from '../../services/flow-execution-state.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { BaseFlowNode } from '../base-flow-node';

export interface CustomAssetsNode extends ComponentDynamicNode {
  agentAsset: IAssetNodeData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './video-gen-node.html',
  styleUrls: ['./video-gen-node.scss'],
  standalone: true,
  imports: [HandleComponent, ProgressSpinner, ButtonModule],
})
export class VideoGenNodeComponent extends BaseFlowNode<CustomAssetsNode> implements OnInit {
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public flowOrchestrationService = inject(FlowOrchestrationService);

  public statusJob = StatusJob;

  override ngOnInit() {
    // You can add initialization logic here if needed in the future.
  }

  public taskExecutionState = computed(() => {
    const executionState: IFlowExecutionStateV2 | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      const executionTask = executionState?.tasks.find(t => t.nodeId === this.node().id);
      if (executionTask) {
        console.log('-------state', executionState);
        return executionTask;
      }
    }
    return null;
  });

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }
}
