import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILeadNode } from '../../models/nodes.model';
import { LeadDetailsComponent } from './lead-details/lead-details';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-lead-node',
  templateUrl: './lead-node.component.html',
  styleUrls: ['./lead-node.component.scss'],
  standalone: true,
  imports: [CommonModule, LeadDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeadNodeComponent implements OnInit {
  @Input() lead!: ILeadNode;
  private dialogService = inject(DialogService);

  ngOnInit(): void {
    console.log(this.lead);
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
        nodeData: this.lead,
      },
      maximizable: true,
    });
  }
}
