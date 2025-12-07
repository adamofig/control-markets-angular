import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILeadNode } from '../../models/nodes.model';
import { LeadDetailsComponent } from './lead-details/lead-details';
import { DialogService } from 'primeng/dynamicdialog';
import { LeadService } from 'src/app/pages/lead/leads.service';
import { ILead } from 'src/app/pages/lead/models/leads.model';

@Component({
  selector: 'app-lead-node',
  templateUrl: './lead-node.component.html',
  styleUrls: ['./lead-node.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeadNodeComponent implements OnInit {
  @Input() lead!: ILead;
  private dialogService = inject(DialogService);
  private leadService = inject(LeadService);

  async ngOnInit(): Promise<void> {
    console.log(this.lead);
    if (!this.lead) {
      alert('No lead found');
      const lead = await this.leadService.findOne('692dea27893ead52574b5a97');
      this.lead = lead as ILead;
    }
  }

  public openModal() {
    debugger;
    this.dialogService.open(LeadDetailsComponent, {
      header: 'Lead Node Details',
      contentStyle: { 'max-height': '90vh', padding: '0px' },
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      modal: false,
      width: '500px',
      data: {
        nodeData: this.lead,
      },
      maximizable: true,
    });
  }
}
