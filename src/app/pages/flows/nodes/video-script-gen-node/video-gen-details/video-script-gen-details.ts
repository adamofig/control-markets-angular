import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';
import { IVideoScriptGenNodeData } from '../../../models/nodes.model';

@Component({
  selector: 'app-video-script-gen-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TextareaModule,
  ],
  templateUrl: './video-script-gen-details.html',
  styleUrl: './video-script-gen-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoScriptGenDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public dynamicDialogRef = inject(DynamicDialogRef);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  public node!: any;
  public prompt = '';
  public script = '';

  constructor() {
    this.node = this.dynamicDialogConfig.data;
  }

  ngOnInit(): void {
    if (this.node?.data?.nodeData) {
      this.prompt = this.node.data.nodeData.prompt || '';
      this.script = this.node.data.nodeData.script || '';
    }
  }

  public save(): void {
    const nodeData: IVideoScriptGenNodeData = {
      ...this.node.data?.nodeData,
      prompt: this.prompt,
      script: this.script,
    };

    this.flowSignalNodeStateService.updateNodeData(this.node.id, {
        ...this.node.data,
        nodeData
    });
    
    this.dynamicDialogRef.close();
  }

  public cancel(): void {
    this.dynamicDialogRef.close();
  }
}
