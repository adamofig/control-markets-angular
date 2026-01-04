import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Connection, Vflow, VflowComponent } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { AgentCardListComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { EntityBaseFormComponent, OnActionEvent } from '@dataclouder/ngx-core';
import { ICreativeFlowBoard, NodeCompTypeStr } from '../models/flows.model';
import { ButtonModule } from 'primeng/button';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormsModule } from '@angular/forms';
import { ILlmTask } from '../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../services/flow-execution-state.service';
import { FlowOrchestrationService } from '../services/flow-orchestration.service';
import { AssetsUploadsComponent } from '../canvas-components/assets-uploads/assets-uploads.component';
import { SourcesUploadsComponent } from '../canvas-components/sources-uploads/sources-uploads.component';
import { FlowService } from '../flows.service';
import { IAssetNodeData } from '../models/nodes.model';
import { ComfyStatusComponent } from '../canvas-components/comfy-status/comfy-status';
import { SpeedDialModule } from 'primeng/speeddial';
import { PopoverModule } from 'primeng/popover';
import { IAgentSource } from '../../sources/models/sources.model';
import { FlowSignalNodeStateService } from '../services/flow-signal-node-state.service';
import { FlowNodeCreationService } from '../services/flow-node-creation.service';
import { FlowSerializationService } from '../services/flow-serialization.service';
import { AppUserService } from '../../../services/app-user.service';
import { AssetsNodeComponent } from '../nodes/assets-node/assets-node.component';
import { FlowNodeRegisterService } from '../services/flow-node-register.service';

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
    PopoverModule,
  ],
})
export class FlowsComponent extends EntityBaseFormComponent<ICreativeFlowBoard> implements OnInit, AfterViewInit {
  public AssetsNodeComponent = AssetsNodeComponent;
  public NodeCompTypeStr = NodeCompTypeStr;
  public flowNodeRegisterService = inject(FlowNodeRegisterService);
  public nodeComponentsList = Object.values(NodeCompTypeStr).map((type: string) => {
    const config = this.flowNodeRegisterService.getNodeConfig(type);
    return {
      type: type as NodeCompTypeStr,
      label: config?.label || type,
      color: config?.color || '#3b82f6',
      icon: config?.icon || 'pi pi-plus'
    };
  });
  override form: FormGroup<any> = new FormGroup({});
  public flowSerializationService = inject(FlowSerializationService);

  public userService = inject(AppUserService);

  override defaultNewObject: ICreativeFlowBoard = {
    name: 'Por favor renombra tu flujo',
    orgId: this.userService.user()?.defaultOrgId || this.userService.user()?._id,
    id: '',
  };

  ngAfterViewInit(): void {
    this.flowDiagramStateService.setVflowComponent(this.vflowRef);
  }
  protected override patchForm(entity: ICreativeFlowBoard): void {
    this.form.patchValue(entity);
  }

  items: any[] = [];
  resourceItems: any[] = [];
  processItems: any[] = [];

  private flowOrchestrationService = inject(FlowOrchestrationService);

  protected entityCommunicationService = inject(FlowService);

  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  private flowNodeCreationService = inject(FlowNodeCreationService);
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

  public flow: ICreativeFlowBoard | null = null;
  public flowId = this.route.snapshot.params['id'];
  public executionId = this.route.snapshot.params['executionId']; // Added outcomeId

  public flowExecutionState = this.flowExecutionStateService.getFlowExecutionStateSignal(); // Updated to use service signal

  @ViewChild('sourceFileInput') sourceFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('vflowRef') vflowRef!: VflowComponent;

  async ngOnInit(): Promise<void> {
    if (this.entityId()) {
      this.flow = await this.flowOrchestrationService.loadInitialFlow(this.flowId, this.executionId);
      this.flowName = this.flow?.name || '';
    }
    console.log('vflowRef', this.vflowRef);

    this.resourceItems = [
      {
        icon: 'pi pi-user-plus',
        label: 'Agent',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AgentNodeComponent)?.color,
        command: () => this.showDialog('agent'),
      },
      {
        icon: 'pi pi-plus-circle',
        label: 'Asset',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AssetsNodeComponent)?.color,
        command: () => this.showDialog('asset'),
      },
      {
        icon: 'pi pi-file-import',
        label: 'Source',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.SourcesNodeComponent)?.color,
        command: () => this.showDialog('source'),
      },
    ];

    this.processItems = [
      {
        icon: 'pi pi-video',
        label: 'Video',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.VideoGenNodeComponent)?.color,
        command: () => this.addVideoGenNode(),
      },
      {
        icon: 'pi pi-file-edit',
        label: 'Video Script',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.VideoScriptGenNodeComponent)?.color,
        command: () => this.addVideoScriptGenNode(),
      },
      {
        icon: 'pi pi-microchip-ai',
        label: 'Task',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.TaskNodeComponent)?.color,
        command: () => this.showDialog('task'),
      },
      {
        icon: 'pi pi-megaphone',
        label: 'Audio',
        color: this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AudioTTsNodeComponent)?.color,
        command: () => this.addAudioTTSGenNode(),
      },
    ];
  }

  public showAgents() {
    this.isDialogVisible = true;
  }

  public createEdge(connection: Connection): void {
    this.flowSignalNodeStateService.createEdge(connection);
  }

  addAgentToFlow(event: OnActionEvent): void {
    const card: IAgentCard = event.item;
    this.flowSignalNodeStateService.addAgentToFlow(card);
    this.closeDialog();
  }

  addTaskToFlow(event: OnActionEvent) {
    console.log('addTaskToFlow', event);
    const task: ILlmTask = event.item;
    this.flowSignalNodeStateService.addTaskToFlow(task);

    this.closeDialog();
  }

  addAssetToFlow(event: IAssetNodeData) {
    console.log('addAssetToFlow', event);

    if (event.type === 'audio') {
      this.flowSignalNodeStateService.addAudioNode(event);
    } else {
      this.flowSignalNodeStateService.addAssetNode(event);
    }
    this.closeDialog();
    this.flowSerializationService.serializeFlow();
  }

  addSourceToFlow(event: Partial<IAgentSource>) {
    // TODO: implement logic to add source from event
    console.log('addSourceToFlow', event);
    this.flowSignalNodeStateService.addSourceNode(event);
    this.closeDialog();
    this.flowSerializationService.serializeFlow();
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
    // console.log('runFlow', this.vflowRef.);
    this.vflowRef.panTo({ x: 0, y: 0 });
    this.vflowRef.zoomTo(1);
    this.vflowRef.documentPointToFlowPoint({ x: 0, y: 0 });

    // this.vflowRef.

    // this.isRunningFlow.set(true);
    // try {
    //   await this.flowOrchestrationService.runFlow(this.flowId, this.flowName);
    // } finally {
    //   this.isRunningFlow.set(false);
    // }
  }

  public addDistributionNode() {
    this.flowSignalNodeStateService.addDistributionNode();
  }

  public addVideoGenNode() {
    this.flowSignalNodeStateService.addVideoGenNode();
    this.flowSerializationService.serializeFlow();
  }

  public addVideoScriptGenNode() {
    this.flowSignalNodeStateService.addVideoScriptGenNode();
    this.flowSerializationService.serializeFlow();
  }

  public addAudioTTSGenNode() {
    this.flowNodeCreationService.addAudioTTSNode();
    this.flowSerializationService.serializeFlow();
  }

  public addEmptyNode(nodeType: NodeCompTypeStr) {
    // this.flowSignalNodeStateService.addEmptyNode(nodeType);
    // this.flowSerializationService.serializeFlow();
    this.addWrapperNode(nodeType, {});
  }
  public addWrapperNode(component: any, inputs: any) {
    debugger
    // this.addEmptyNode(component);
    this.flowSignalNodeStateService.addWrapperNode(component, inputs);
    this.flowSerializationService.serializeFlow();
  }
}
