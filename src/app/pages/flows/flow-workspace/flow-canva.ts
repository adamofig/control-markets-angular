import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Connection, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { AgentCardListComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { OnActionEvent, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { IAgentFlows } from '../models/flows.model';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IAgentTask } from '../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../services/flow-execution-state.service';
import { FlowOrchestrationService } from '../services/flow-orchestration.service';

@Component({
  templateUrl: './flow-canva.html',
  styleUrl: './flow-canva.css',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [Vflow, DialogModule, AgentCardListComponent, ButtonModule, TaskListComponent, InputTextModule, FormsModule],
})
export class FlowsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private flowOrchestrationService = inject(FlowOrchestrationService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public toastService = inject(TOAST_ALERTS_TOKEN);

  public flowName = '';
  public isSavingFlow = signal(false);
  public isRunningFlow = signal(false);

  public isDialogVisible = false;

  public dialogs = { isAgentVisible: false, isTaskVisible: false };

  public backDots = {
    backgroundColor: 'transparent',
    color: '#f4fc0088',
    type: 'dots' as any,
    size: 1,
  };

  public flow: IAgentFlows | null = null;
  public flowId = this.route.snapshot.params['id'];
  public executionId = this.route.snapshot.params['executionId']; // Added outcomeId

  public flowExecutionState = this.flowExecutionStateService.getFlowExecutionStateSignal(); // Updated to use service signal

  @ViewChild('sourceFileInput') sourceFileInput!: ElementRef<HTMLInputElement>;

  async ngOnInit(): Promise<void> {
    if (this.flowId) {
      this.flow = await this.flowOrchestrationService.loadInitialFlow(this.flowId, this.executionId);
      this.flowName = this.flow?.name || '';
    } else {
      await this.flowOrchestrationService.createNewFlow();
    }
  }

  public showAgents() {
    this.isDialogVisible = true;
  }

  public createEdge(connection: Connection): void {
    this.flowDiagramStateService.createEdge(connection);
  }

  addAgentToFlow(event: OnActionEvent): void {
    debugger;
    const card: IAgentCard = event.item;
    this.flowDiagramStateService.addAgentToFlow(card);
    this.isDialogVisible = false;
  }

  addTaskToFlow(event: OnActionEvent) {
    console.log('addTaskToFlow', event);
    const task: IAgentTask = event.item;
    this.flowDiagramStateService.addTaskToFlow(task);

    this.isDialogVisible = false;
  }

  public async saveFlow(): Promise<void> {
    this.isSavingFlow.set(true);
    try {
      await this.flowOrchestrationService.saveFlow(this.flowId, this.flowName);
    } finally {
      this.isSavingFlow.set(false);
    }
  }

  public showDialog(key: string) {
    // this.isDialogVisible = true;
    this.dialogs.isAgentVisible = false;
    this.dialogs.isTaskVisible = false;

    (this.dialogs as any)[key] = true;

    console.log(this.dialogs);
    this.isDialogVisible = true;
  }

  public async runFlow(): Promise<void> {
    this.isRunningFlow.set(true);
    try {
      await this.flowOrchestrationService.runFlow(this.flowId, this.flowName);
    } finally {
      this.isRunningFlow.set(false);
    }
  }

  public addDistributionNode() {
    this.flowDiagramStateService.addDistributionNode();
  }

  public addSourceNode(): void {
    // Trigger the hidden file input
    this.sourceFileInput.nativeElement.click();
  }

  public onSourceFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const markdownContent = e.target?.result as string;

          this.flowDiagramStateService.addSourceNode(markdownContent);
          console.log('New source node added with markdown content from file:', file.name);
          // Reset file input to allow selecting the same file again if needed
          if (this.sourceFileInput) {
            this.sourceFileInput.nativeElement.value = '';
          }
        };
        reader.onerror = e => {
          console.error('Error reading file:', e);
          // Reset file input
          if (this.sourceFileInput) {
            this.sourceFileInput.nativeElement.value = '';
          }
        };
        reader.readAsText(file);
      } else {
        console.warn('Please select a Markdown (.md) file.');
        this.toastService.info({ title: 'Invalid File', subtitle: 'Please select a Markdown (.md) file.' }); // Changed to info
        // Reset file input
        if (this.sourceFileInput) {
          this.sourceFileInput.nativeElement.value = '';
        }
      }
    }
  }
}
