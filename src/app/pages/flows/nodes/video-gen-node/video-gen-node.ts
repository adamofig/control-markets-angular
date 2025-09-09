import { Component, computed, inject, OnInit } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { StatusJob } from '../../models/flows.model';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { BaseFlowNode } from '../base-flow-node';
import { INodeVideoGenerationData } from '../../models/nodes.model';
import { TagModule, Tag } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

export interface CustomAssetsNode extends ComponentDynamicNode {
  nodeData: INodeVideoGenerationData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './video-gen-node.html',
  styleUrls: ['./video-gen-node.scss'],
  standalone: true,
  imports: [HandleComponent, ProgressSpinner, ButtonModule, TagModule, TextareaModule, FormsModule],
})
export class VideoGenNodeComponent extends BaseFlowNode<CustomAssetsNode> implements OnInit {
  public flowOrchestrationService = inject(FlowOrchestrationService);

  public statusJob = StatusJob;
  public override nodeCategory: 'process' | 'input' | 'output' = 'process';

  // public prompt = this.node()?.data?.nodeData?.prompt || 'Describe your idea';
  public prompt = 'Describe your idea';

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.prompt = this.node()?.data?.nodeData?.prompt || 'Describe your idea';
  }
}
