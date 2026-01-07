import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { SourceNodeDetailsComponent } from './sources-details/source-node-details'; // Updated import
import { IAgentSource } from 'src/app/pages/sources/models/sources.model'; // Corrected import
import { ButtonModule } from 'primeng/button';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { FlowComponentRefStateService } from '../../services/flow-component-ref-state.service';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { TagModule } from 'primeng/tag';
import { FlowSignalNodeStateService } from '../../services/flow-signal-node-state.service';
import { BaseFlowNode } from '../base-flow-node';
import { CommonModule } from '@angular/common';
import { INodeConfig } from '../../models/flows.model';

export interface CustomSourceNode extends ComponentDynamicNode {
  // Renamed interface
  data?: any;
  config: INodeConfig;
  nodeData: IAgentSource | null; // Updated property name
}

@Component({
  selector: 'app-sources-node', // Updated selector
  imports: [Vflow, DialogModule, ButtonModule, BaseNodeToolbarComponent, TagModule, SlicePipe, CommonModule],
  templateUrl: './sources-node.component.html', // Updated template URL
  styleUrl: './sources-node.component.scss', // Updated style URL
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SourcesNodeComponent extends BaseFlowNode<CustomSourceNode> implements OnInit, OnDestroy {
  // Renamed class
  public override flowDiagramStateService = inject(FlowDiagramStateService);
  public override flowComponentRefStateService = inject(FlowComponentRefStateService);
  protected override flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  public source: IAgentSource | null = null; // Updated property

  @ViewChild('dialog') dialog!: ViewContainerRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  constructor() {
    super();
    effect(() => {
      console.log('sources-node source:', this.nodeData()); // Updated log and property
      this.source = this.nodeData() || null; // Updated property
    });
  }

  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;

    this.dialogService.open(SourceNodeDetailsComponent, {
      // Updated component
      header: 'Source Node', // Updated header
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      width: '650px',
      data: this.node(),
    });
  }

  override removeNode() {
    this.flowSignalNodeStateService.removeNode(this.node().id);
  }

  override handleToolbarEvents(event: string) {
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
