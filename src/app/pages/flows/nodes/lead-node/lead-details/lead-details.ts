import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILeadNode } from '../../../models/nodes.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.html',
  styleUrls: ['./lead-details.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, RippleModule],
})
export class LeadDetailsComponent implements OnInit {
  @Input() nodeData: ILeadNode | undefined;
  private dialogConfig = inject(DynamicDialogConfig);

  ngOnInit(): void {
    this.nodeData = this.dialogConfig.data.nodeData;
    console.log('lead-details', this.nodeData);
  }

  public getLeadFromSource() {
    // this.httpService.getHttp({ service: '', host: '' });
  }

  copyToClipboard(text: string | undefined | object) {
    if (!text) {
      return;
    }
    const textToCopy = typeof text === 'object' ? JSON.stringify(text, null, 2) : text;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        console.log('Copied to clipboard');
        // You can add a toast message here to notify the user
      },
      err => {
        console.error('Could not copy text: ', err);
      }
    );
  }
}
