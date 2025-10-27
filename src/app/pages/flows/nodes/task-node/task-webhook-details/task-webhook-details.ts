import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-task-webhook-details',
  templateUrl: './task-webhook-details.html',
  styleUrls: ['./task-webhook-details.css'],
  standalone: true,
})
export class TaskWebhookDetailsComponent implements OnInit {
  public exeUrl: string;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.exeUrl = this.config.data.exeUrl;
  }

  ngOnInit(): void {}
}
