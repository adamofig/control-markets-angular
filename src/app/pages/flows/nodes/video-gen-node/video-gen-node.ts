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
import { FormBuilder, FormsModule } from '@angular/forms';
import { ComfyVideoOptionsRequestFormComponent } from '@dataclouder/ngx-vertex';

export interface CustomAssetsNode extends ComponentDynamicNode {
  nodeData: INodeVideoGenerationData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './video-gen-node.html',
  styleUrls: ['./video-gen-node.scss'],
  standalone: true,
  imports: [HandleComponent, ProgressSpinner, ButtonModule, TagModule, TextareaModule, FormsModule, ComfyVideoOptionsRequestFormComponent],
})
export class VideoGenNodeComponent extends BaseFlowNode<CustomAssetsNode> implements OnInit {
  public flowOrchestrationService = inject(FlowOrchestrationService);

  public fb = inject(FormBuilder);

  public statusJob = StatusJob;
  public override nodeCategory: 'process' | 'input' | 'output' = 'process';

  public formValue = 'Éste es el valor';

  public form = this.fb.group({
    seconds: [2],
    width: [300],
    height: [576],
  });

  // public prompt = this.node()?.data?.nodeData?.prompt || 'Describe your idea';
  public prompt = 'Describe your idea';

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.prompt = this.node()?.data?.nodeData?.prompt || 'Describe your idea';
    if (this.node()?.data?.nodeData?.request) {
      this.form.setValue(this.node()?.data?.nodeData?.request || {});
    }
  }
}
