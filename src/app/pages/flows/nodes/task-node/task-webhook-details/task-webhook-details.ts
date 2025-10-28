import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpCoreService } from '@dataclouder/ngx-core';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-task-webhook-details',
  templateUrl: './task-webhook-details.html',
  styleUrls: ['./task-webhook-details.css'],
  standalone: true,
  imports: [CommonModule, Button, FormsModule, InputTextModule],
})
export class TaskWebhookDetailsComponent implements OnInit {
  public postRequest: any;
  public newAttributeKey: string = '';
  public newAttributeValue: string = '';

  private httpCoreService = inject(HttpCoreService);

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.postRequest = this.config.data.postRequest;
  }

  ngOnInit(): void {}

  public addAttribute(): void {
    if (this.newAttributeKey && this.newAttributeValue) {
      if (!this.postRequest.body) {
        this.postRequest.body = {};
      }
      this.postRequest.body[this.newAttributeKey] = this.newAttributeValue;
      this.newAttributeKey = '';
      this.newAttributeValue = '';
    }
  }

  public async callWebhook(): Promise<void> {
    await this.httpCoreService.postHttp({
      host: this.postRequest.host,
      data: this.postRequest.body,
      service: this.postRequest.service,
    });
  }
}
