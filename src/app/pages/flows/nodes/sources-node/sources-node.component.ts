import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { SourcesDetailsComponent } from './sources-details/sources-details.component'; // Updated import
import { IAgentSource } from 'src/app/pages/sources/models/sources.model'; // Corrected import
import { ButtonModule } from 'primeng/button';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { FlowComponentRefStateService } from '../../services/flow-component-ref-state.service';

export interface CustomSourceNode extends ComponentDynamicNode {
  // Renamed interface
  nodeData: IAgentSource | null; // Updated property name
}

@Component({
  selector: 'app-sources-node', // Updated selector
  imports: [Vflow, DialogModule, ButtonModule],
  templateUrl: './sources-node.component.html', // Updated template URL
  styleUrl: './sources-node.component.css', // Updated style URL
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SourcesNodeComponent extends CustomNodeComponent<CustomSourceNode> implements OnInit, OnDestroy {
  // Renamed class
  public dialogService = inject(DialogService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowComponentRefStateService = inject(FlowComponentRefStateService);

  public source: IAgentSource | null = null; // Updated property

  @ViewChild('dialog') dialog!: ViewContainerRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  override ngOnInit() {
    super.ngOnInit();
    this.flowComponentRefStateService.addNodeComponentRef(this.node().id, this);
  }

  ngOnDestroy() {
    this.flowComponentRefStateService.removeNodeComponentRef(this.node().id);
  }

  constructor() {
    super();
    effect(() => {
      console.log('sources-node source:', this.data()?.nodeData); // Updated log and property
      this.source = this.data()?.nodeData || null; // Updated property
    });
  }

  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;

    this.dialogService.open(SourcesDetailsComponent, {
      // Updated component
      header: 'Source Node', // Updated header
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
      width: '650px',
      data: this.data(),
    });
  }

  removeNode() {
    this.flowDiagramStateService.removeNode(this.node().id);
  }
}
