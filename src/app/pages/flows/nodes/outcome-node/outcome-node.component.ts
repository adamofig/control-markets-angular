import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { ComponentDynamicNode, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { IAgentOutcomeJob, ResponseFormat } from 'src/app/pages/jobs/models/jobs.model';
import { OutcomeJobDetailComponent } from 'src/app/pages/jobs/job-detail/job-detail.component';
import { ButtonModule } from 'primeng/button';
import { JsonPipe } from '@angular/common';
import { BaseFlowNode } from '../base-flow-node';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';

export interface CustomOutcomeNode extends ComponentDynamicNode {
  nodeData: IAgentOutcomeJob;
  inputNodeId: string;
  processNodeId: string;
}

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow, DialogModule, ButtonModule, JsonPipe, BaseNodeToolbarComponent],
  templateUrl: './outcome-node.component.html',
  styleUrl: './outcome-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OutcomeNodeComponent extends BaseFlowNode<CustomOutcomeNode> implements OnInit {
  public dialogService = inject(DialogService);
  public outcomeJob: IAgentOutcomeJob | null = null;
  public responseFormat = ResponseFormat;
  public backgroundImageUrl = signal<string>('');

  @ViewChild('dialog') dialog!: ViewContainerRef;

  override ngOnInit(): void {
    super.ngOnInit();
    setTimeout(() => {
      const inputNodeId = this.node().data?.inputNodeId || '';
      console.log('outcomeJob', inputNodeId);
      const inputNodeComponent = this.flowComponentRefStateService.getNodeComponentRef(inputNodeId);
      const imageForInput = inputNodeComponent?.data()?.nodeData?.assets?.image?.url;
      console.log('imageForInput....', imageForInput);
      this.backgroundImageUrl.set(imageForInput);
      console.log('inputNodeComponent', this.backgroundImageUrl());
    }, 500);

    console.log('outcomeJob', this.outcomeJob);
    console.log('nodeData', this.data()?.nodeData);
  }

  constructor() {
    super();
    this.backgroundImageUrl.set(`url('assets/defaults/images/default_2_3.webp')`);
    effect(() => {
      this.outcomeJob = this.data()?.nodeData || null;
      // if (this.outcomeJob) {
      //   const imageUrl = this.outcomeJob?.agentCard?.assets?.image?.url;
      //   this.backgroundImageUrl.set(imageUrl ? `url('${imageUrl}')` : `url('assets/defaults/images/default_2_3.webp')`);
      //   console.log('outcomeJob', this.outcomeJob.result);
      // }
    });
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;
    this.dialogService.open(OutcomeJobDetailComponent, {
      header: 'Outcome Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      width: '650px',
      inputValues: {
        jobInput: this.outcomeJob,
      },
      duplicate: true,
    });
  }

  override handleToolbarEvents(event: 'delete' | 'none' | 'details'): void {
    switch (event) {
      case 'delete':
        this.removeNode();
        break;
      case 'none':
        break;
      case 'details':
        this.openModal();
        break;
    }
  }
}
