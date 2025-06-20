import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { OutcomeDetailsComponent } from './outcome-details/outcome-details';
import { IAgentJob } from 'src/app/pages/jobs/models/jobs.model';
import { JobDetailComponent } from 'src/app/pages/jobs/job-detail/job-detail.component';

export interface CustomOutcomeNode extends ComponentDynamicNode {
  outcomeJob: IAgentJob | null;
}

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow, DialogModule],
  templateUrl: './outcome-node.component.html',
  styleUrl: './outcome-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OutcomeNodeComponent extends CustomNodeComponent<CustomOutcomeNode> implements OnInit {
  public dialogService = inject(DialogService);

  public outcomeJob: IAgentJob | null = null;

  @ViewChild('dialog') dialog!: ViewContainerRef;

  constructor() {
    super();
    effect(() => {
      console.log('outcome-node', this.data()?.outcomeJob);
      this.outcomeJob = this.data()?.outcomeJob || null;
    });
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;
    this.dialogService.open(JobDetailComponent, {
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
}
