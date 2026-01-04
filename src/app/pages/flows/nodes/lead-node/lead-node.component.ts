import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadDetailsComponent } from './lead-details/lead-details';
import { LeadService } from 'src/app/pages/lead/leads.service';
import { ILead } from 'src/app/pages/lead/models/leads.model';
import { BaseFlowNode } from '../base-flow-node';
import { INodeConfig } from '../../models/flows.model';
import { ComponentDynamicNode } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';

export interface CustomLeadNode extends ComponentDynamicNode {
  data?: any;
  config: INodeConfig;
  nodeData: ILead;
}

@Component({
  selector: 'app-lead-node',
  templateUrl: './lead-node.component.html',
  styleUrls: ['./lead-node.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeadNodeComponent extends BaseFlowNode<CustomLeadNode> implements OnInit {
  public lead: ILead | null = null;
  private dialogService = inject(DialogService);
  private leadService = inject(LeadService);

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.lead = this.nodeData();
    console.log(this.lead);
    if (!this.lead) {
      alert('No lead found');
      const lead = await this.leadService.findOne('692dea27893ead52574b5a97');
      this.lead = lead as ILead;
    }
  }

  public openModal() {
    this.dialogService.open(LeadDetailsComponent, {
      header: 'Lead Node Details',
      contentStyle: { 'max-height': '90vh', padding: '0px' },
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      modal: false,
      width: '500px',
      data: {
        nodeData: this.lead || this.nodeData(),
      },
      maximizable: true,
    });
  }
}
