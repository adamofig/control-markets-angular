import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';
import { IVideoScriptGenNodeData } from '../../../models/nodes.model';
import { DialogsComponent } from '../../../../video-projects-gen/dialogs/dialogs.component';

@Component({
  selector: 'app-video-script-gen-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TextareaModule,
    DialogsComponent,
  ],
  templateUrl: './video-script-gen-details.html',
  styleUrl: './video-script-gen-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoScriptGenDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public dynamicDialogRef = inject(DynamicDialogRef);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  private fb = inject(FormBuilder);

  public node!: any;
  public form!: FormGroup;

  constructor() {
    this.node = this.dynamicDialogConfig.data;
    this.initForm();
  }

  private initForm(): void {
    const nodeData = this.node?.data?.nodeData;
    this.form = this.fb.group({
      prompt: [nodeData?.prompt || ''],
      script: [nodeData?.script || ''],
      dialogs: this.fb.array([]),
    });
  }

  get dialogsFormArray(): any {
    return this.form.get('dialogs');
  }

  ngOnInit(): void {
    // Current data is handled in initForm which is called in constructor
    // If needed updates from node.data.nodeData could be added here.
  }

  public save(): void {
    const nodeData: IVideoScriptGenNodeData = {
      ...this.node.data?.nodeData,
      ...this.form.value,
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
