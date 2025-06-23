import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
import { IAgentSource } from 'src/app/pages/sources/models/sources.model'; // Import IAgentSource
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-sources-details', // Updated selector
  imports: [Vflow, DialogModule, JsonPipe, MarkdownModule],
  templateUrl: './sources-details.component.html', // Updated template URL
  styleUrl: './sources-details.component.css', // Updated style URL
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesDetailsComponent implements OnInit {
  // Renamed class
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public source: IAgentSource | null = null; // Add property for source data

  constructor() {
    console.log(this.dynamicDialogConfig.data);
    // Assign source data from dialog config
    if (this.dynamicDialogConfig.data) {
      this.source = this.dynamicDialogConfig.data;
    }
  }

  ngOnInit(): void {
    console.log(this.dynamicDialogConfig.data);
  }

  // Optional: Add any specific methods for sources details
  public displaySourceInfo(): void {
    console.log('Source Info:', this.source);
  }
}
