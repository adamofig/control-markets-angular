import { Component, ViewChild, ViewContainerRef, OnInit, Type, ComponentRef, inject } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { ComponentDynamicNode } from 'ngx-vflow';
import { CommonModule } from '@angular/common';
import { HandleComponent } from 'ngx-vflow';
import { TagModule } from 'primeng/tag';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { FlowNodeRegisterService } from '../../services/flow-node-register.service';
import { VideoScriptGenDetailsComponent } from '../video-script-gen-node/video-gen-details/video-script-gen-details';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { ActionsToolbarComponent } from '../actions-toolbar/actions-toolbar.component';

export interface WrapperNode extends ComponentDynamicNode {
  nodeData: { [key: string]: any };
}

@Component({
  selector: 'app-wrapper-node',
  templateUrl: './wrapper-node.component.html',
  styleUrls: ['./wrapper-node.component.scss'],
  standalone: true,
  imports: [CommonModule, HandleComponent, TagModule, BaseNodeToolbarComponent, ActionsToolbarComponent],
})
export class WrapperNodeComponent extends BaseFlowNode<WrapperNode> implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  private flowNodeRegisterService = inject(FlowNodeRegisterService);
  private flowOrchestrationService = inject(FlowOrchestrationService);
  private dialogService = inject(DialogService);

  private componentRef!: ComponentRef<any>;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadComponent();
  }

  private loadComponent(): void {
    const nodeData = this.node()?.data?.nodeData;
    const component = (this.node() as any)?.component;
    if (component) {
      this.container.clear();
      const ComponentType = this.flowNodeRegisterService.getNodeType(component);
      if (ComponentType) {
        this.componentRef = this.container.createComponent(ComponentType);

        if (nodeData && this.componentRef) {
          // Check if we have a nested 'inputs' object or if nodeData itself is the inputs
          const inputs = nodeData['inputs'] || nodeData;
          Object.keys(inputs).forEach(inputName => {
            if (inputName in this.componentRef.instance) {
              this.componentRef.instance[inputName] = inputs[inputName];
            }
          });
        }
      } else {
        console.warn(`Component type not found for: ${component}`);
      }
    }
  }

  // public openModal() {
  //   debugger;
  //   const component = (this.node() as any)?.component;
  //   if (component === 'VideoScriptGenContent') {
  //     this.dialogService.open(VideoScriptGenDetailsComponent, {
  //       header: 'Video Script Generation Details',
  //       modal: false,
  //       contentStyle: { overflow: 'auto' },
  //       baseZIndex: 10000,
  //       draggable: true,
  //       styleClass: 'draggable-dialog',
  //       closable: true,
  //       data: this.node(),
  //       width: '450px',
  //     });
  //   }
  // }

  runNode(): void {
    const flowId = this.flowDiagramStateService.getFlow()?.id;
    if (flowId) {
      this.flowOrchestrationService.runNode(flowId, this.node().id);
    }
  }

  handleActionsToolbarEvents(event: 'runNode' | 'runEndPoint' | any): void {
    const action = typeof event === 'string' ? event : event.action;
    switch (action) {
      case 'runNode':
        this.runNode();
        break;
      case 'runEndPoint':
        // this.directEndPoint();
        break;
    }
  }
}
