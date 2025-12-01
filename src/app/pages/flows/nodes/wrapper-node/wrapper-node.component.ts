import { Component, ViewChild, ViewContainerRef, OnInit, Type, ComponentRef, inject } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { ComponentDynamicNode } from 'ngx-vflow';
import { CommonModule } from '@angular/common';
import { HandleComponent } from 'ngx-vflow';
import { TagModule } from 'primeng/tag';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { FlowNodeRegisterService } from '../../services/flow-node-register.service';

export interface WrapperNode extends ComponentDynamicNode {
  nodeData: { [key: string]: any };
}

@Component({
  selector: 'app-wrapper-node',
  templateUrl: './wrapper-node.component.html',
  styleUrls: ['./wrapper-node.component.scss'],
  standalone: true,
  imports: [CommonModule, HandleComponent, TagModule, BaseNodeToolbarComponent],
})
export class WrapperNodeComponent extends BaseFlowNode<WrapperNode> implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  private flowNodeRegisterService = inject(FlowNodeRegisterService);

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
    if (nodeData) {
      if (component) {
        this.container.clear();
        const ComponentType = this.flowNodeRegisterService.getNodeType(component);
        if (ComponentType) {
          this.componentRef = this.container.createComponent(ComponentType);
        }
        if (nodeData) {
          Object.keys(nodeData).forEach(inputName => {
            this.componentRef.instance[inputName] = nodeData[inputName];
          });
        }
      }
    }
  }

  public openModal() {
    // alert('No hay configuración para el modal');
  }
}
