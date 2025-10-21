import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Connection, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { AgentCardListComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { EntityBaseFormComponent, OnActionEvent } from '@dataclouder/ngx-core';
import { IAgentFlows } from '../models/flows.model';
import { ButtonModule } from 'primeng/button';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormsModule } from '@angular/forms';
import { IAgentTask } from '../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../services/flow-execution-state.service';
import { FlowOrchestrationService } from '../services/flow-orchestration.service';
import { AssetsUploadsComponent } from '../canvas-components/assets-uploads/assets-uploads.component';
import { SourcesUploadsComponent } from '../canvas-components/sources-uploads/sources-uploads.component';
import { FlowService } from '../flows.service';
import { IAssetNodeData } from '../models/nodes.model';
import { ComfyStatusComponent } from '../canvas-components/comfy-status/comfy-status';
import { SpeedDialModule } from 'primeng/speeddial';
import { RedSquareData, RedSquareNodeComponent } from '../nodes/test-node/test-node';
import { IAgentSource } from '../../sources/models/sources.model';

@Component({
  templateUrl: './flow-canva.html',
  styleUrl: './flow-canva.css',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    Vflow,
    DialogModule,
    AgentCardListComponent,
    ButtonModule,
    TaskListComponent,
    InputTextModule,
    FormsModule,
    AssetsUploadsComponent,
    SourcesUploadsComponent,
    ComfyStatusComponent,
    SpeedDialModule,
  ],
})
export class FlowsComponent extends EntityBaseFormComponent<IAgentFlows> implements OnInit {
  override form: FormGroup<any> = new FormGroup({});

  protected override patchForm(entity: IAgentFlows): void {
    this.form.patchValue(entity);
  }

  items: any[] = [];
  resourceItems: any[] = [];
  processItems: any[] = [];

  private flowOrchestrationService = inject(FlowOrchestrationService);

  protected entityCommunicationService = inject(FlowService);

  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  // public toastService = inject(TOAST_ALERTS_TOKEN);

  public flowName = '';
  public isSavingFlow = signal(false);
  public isRunningFlow = signal(false);

  public isDialogVisible = false;

  public activeDialog: 'agent' | 'task' | 'asset' | 'source' | null = null;

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
    if (this.entityId()) {
      this.flow = await this.flowOrchestrationService.loadInitialFlow(this.flowId, this.executionId);
      this.flowName = this.flow?.name || '';
    }

    this.resourceItems = [
      {
        icon: 'pi pi-user-plus',
        label: 'Agent',
        command: () => this.showDialog('agent'),
      },
      {
        icon: 'pi pi-plus-circle',
        label: 'Asset',
        command: () => this.showDialog('asset'),
      },
      {
        icon: 'pi pi-file-import',
        label: 'Source',
        command: () => this.showDialog('source'),
      },
    ];

    this.processItems = [
      {
        icon: 'pi pi-video',
        label: 'Video',
        command: () => this.addVideoGenNode(),
      },
      {
        icon: 'pi pi-microchip-ai',
        label: 'Task',
        command: () => this.showDialog('task'),
      },
      {
        icon: 'pi pi-megaphone',
        label: 'Audio',
        command: () => this.addAudioTTSGenNode(),
      },
    ];
  }

  public showAgents() {
    this.isDialogVisible = true;
  }

  public createEdge(connection: Connection): void {
    this.flowDiagramStateService.createEdge(connection);
  }

  addAgentToFlow(event: OnActionEvent): void {
    const card: IAgentCard = event.item;
    this.flowDiagramStateService.addAgentToFlow(card);
    this.closeDialog();
  }

  addTaskToFlow(event: OnActionEvent) {
    console.log('addTaskToFlow', event);
    const task: IAgentTask = event.item;
    this.flowDiagramStateService.addTaskToFlow(task);

    this.closeDialog();
  }

  addAssetToFlow(event: IAssetNodeData) {
    console.log('addAssetToFlow', event);
    this.flowDiagramStateService.addAssetNode(event);
    this.closeDialog();
  }

  addSourceToFlow(event: Partial<IAgentSource>) {
    // TODO: implement logic to add source from event
    console.log('addSourceToFlow', event);
    this.flowDiagramStateService.addSourceNode(event);
    this.closeDialog();
  }

  public async saveFlow(): Promise<void> {
    this.isSavingFlow.set(true);
    try {
      await this.flowOrchestrationService.saveFlow(this.flowId, this.flowName);
    } finally {
      this.isSavingFlow.set(false);
    }
  }

  public showDialog(dialogType: 'agent' | 'task' | 'asset' | 'source') {
    this.activeDialog = dialogType;
    this.isDialogVisible = true;
  }

  public closeDialog() {
    this.isDialogVisible = false;
    this.activeDialog = null;
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

  public addVideoGenNode() {
    this.flowDiagramStateService.addVideoGenNode();
  }

  public addAudioTTSGenNode() {
    this.flowDiagramStateService.addAudioTTSGenNode();
  }
}
