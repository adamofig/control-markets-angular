import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { OutcomeDetailsComponent } from './outcome-details/outcome-details';
import { IAgentOutcomeJob, ResponseFormat } from 'src/app/pages/jobs/models/jobs.model';
import { OutcomeJobDetailComponent } from 'src/app/pages/jobs/job-detail/job-detail.component';
import { ButtonModule } from 'primeng/button';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { FlowComponentRefStateService } from '../../services/flow-component-ref-state.service';
import { JsonPipe } from '@angular/common';

export interface CustomOutcomeNode extends ComponentDynamicNode {
  outcomeJob: IAgentOutcomeJob | null;
}

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow, DialogModule, ButtonModule, JsonPipe],
  templateUrl: './outcome-node.component.html',
  styleUrl: './outcome-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OutcomeNodeComponent extends CustomNodeComponent<CustomOutcomeNode> implements OnInit, OnDestroy {
  public dialogService = inject(DialogService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowComponentRefStateService = inject(FlowComponentRefStateService);

  public outcomeJob: IAgentOutcomeJob | null = null;
  public responseFormat = ResponseFormat;
  public backgroundImageUrl: string;

  @ViewChild('dialog') dialog!: ViewContainerRef;

  override ngOnInit() {
    super.ngOnInit();
    this.flowComponentRefStateService.addNodeComponentRef(this.node().id, this);
  }

  ngOnDestroy() {
    this.flowComponentRefStateService.removeNodeComponentRef(this.node().id);
  }

  constructor() {
    super();
    this.backgroundImageUrl = `url('assets/defaults/images/default_2_3.webp')`;
    effect(() => {
      this.outcomeJob = this.data()?.outcomeJob || null;
      const imageUrl = this.outcomeJob?.agentCard?.assets?.image?.url;
      this.backgroundImageUrl = imageUrl ? `url('${imageUrl}')` : `url('assets/defaults/images/default_2_3.webp')`;
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
      closable: true,
      width: '650px',
      inputValues: {
        jobInput: this.outcomeJob,
      },
    });
  }

  removeNode() {
    this.flowDiagramStateService.removeNode(this.node().id);
  }
}
