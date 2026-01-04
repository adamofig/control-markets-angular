import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { ComponentDynamicNode, HandleComponent } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { CommonModule } from '@angular/common';
import { EmptyDetailsComponent } from './empty-details/empty-details';

export interface CustomEmptyNode extends ComponentDynamicNode {
  nodeData: any;
}

@Component({
  selector: 'app-empty-node-component',
  standalone: true,
  imports: [HandleComponent, BaseNodeToolbarComponent, CommonModule],
  templateUrl: './empty-node.html',
  styleUrl: './empty-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// COPY THIS NODE TO CREATE NEW NODES
export class EmptyNodeComponent implements OnInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  private toastService = inject(TOAST_ALERTS_TOKEN);
  public dialogService = inject(DialogService);



  public openModal() {

    const nodeData = {};
    this.dialogService.open(EmptyDetailsComponent, {
      header: 'Empty Node Details',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      width: '650px',
      duplicate: true, 
      modal: true,
      data: {
        ...nodeData,
      },
    });
  }
}
