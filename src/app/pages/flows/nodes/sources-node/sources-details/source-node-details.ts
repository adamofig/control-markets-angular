import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
import { IAgentSource } from 'src/app/pages/sources/models/sources.model'; // Import IAgentSource
import { MarkdownModule } from 'ngx-markdown';
import { SourceFormComponent } from 'src/app/pages/sources/source-form/source-form.component';
import { FlowDiagramStateService } from '../../../services/flow-diagram-state.service';
import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';

@Component({
  selector: 'app-source-node-details', // Updated selector
  imports: [Vflow, DialogModule, JsonPipe, MarkdownModule, SourceFormComponent, ButtonModule],
  templateUrl: './source-node-details.html', // Updated template URL
  styleUrl: './source-node-details.css', // Updated style URL
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceNodeDetailsComponent implements OnInit {
  // Renamed class
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public source: IAgentSource | null = null; // Add property for source data
  public isEditing = false;
  public flowStateService = inject(FlowDiagramStateService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  constructor() {
    console.log(this.dynamicDialogConfig.data);
    // Assign source data from dialog config
    if (this.dynamicDialogConfig.data) {
      this.source = this.dynamicDialogConfig.data?.data?.nodeData;
    }
  }

  ngOnInit(): void {
    console.log(this.dynamicDialogConfig.data);
  }

  // Optional: Add any specific methods for sources details
  public displaySourceInfo(): void {
    console.log('Source Info:', this.source);
  }

  public fakeSaved(data: any) {
    console.log('Source Info:', data, this.dynamicDialogConfig.data);
    const nodeId = this.dynamicDialogConfig.data.id;
    this.flowSignalNodeStateService.updateNodeData(nodeId, { nodeData: data });
  }
}
