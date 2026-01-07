import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-execution-details',
  standalone: true,
  imports: [CommonModule, TagModule, DividerModule],
  template: `
    <div class="execution-details-container">
      <div class="header">
        <p-tag [value]="status" [severity]="severity"></p-tag>
        <span class="node-id">ID: {{ node?.id }}</span>
      </div>

      <p-divider></p-divider>

      <div class="section">
        <h3>Status Description</h3>
        <div class="description-box" [class.failed]="status === 'failed'">
          {{ description || 'No detailed status information available.' }}
        </div>
      </div>

      @if (messages && messages.length > 0) {
        <div class="section">
          <h3>Message Logs</h3>
          <div class="messages-list">
            @for (msg of messages; track $index) {
              <div class="message-item">
                <div class="msg-meta">
                  <span class="timestamp">{{ msg.createdAt | date:'mediumTime' }}</span>
                </div>
                <p class="msg-text">{{ msg.text }}</p>
                @if (msg.details) {
                   <pre class="msg-details">{{ msg.details }}</pre>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .execution-details-container {
      padding: 0 10px;
      color: #eee;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .node-id {
      font-family: monospace;
      font-size: 11px;
      color: #666;
    }
    .section {
      margin-bottom: 25px;
    }
    h3 {
      font-size: 12px;
      color: #888;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .description-box {
      background: #1a1a2a;
      padding: 16px;
      border-radius: 10px;
      border-left: 4px solid #3b82f6;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }
    .description-box.failed {
      border-left-color: #ef4444;
      background: #2a1a1a;
    }
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .message-item {
      background: #252535;
      border: 1px solid #334;
      padding: 12px;
      border-radius: 8px;
    }
    .msg-meta {
      margin-bottom: 5px;
    }
    .timestamp {
      font-size: 10px;
      color: #778;
      font-family: monospace;
    }
    .msg-text {
      margin: 0;
      font-size: 13px;
    }
    .msg-details {
      margin-top: 10px;
      font-size: 11px;
      background: #0d0d17;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
      color: #aab;
      border: 1px solid #223;
    }
  `]
})
export class ExecutionDetailsComponent implements OnInit {
  private config = inject(DynamicDialogConfig);
  public node: any;
  public status: string = '';
  public severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined = undefined;
  public description: string = '';
  public messages: any[] = [];

  ngOnInit() {
    this.node = this.config.data?.node;
    const state = this.config.data?.state;
    if (state) {
      this.status = state.status || 'default';
      this.description = state.statusDescription;
      this.messages = state.messages || [];

      switch (this.status) {
        case 'completed': this.severity = 'success'; break;
        case 'failed': this.severity = 'danger'; break;
        case 'in_progress': this.severity = 'info'; break;
        case 'pending': this.severity = 'warn'; break;
        default: this.severity = 'contrast';
      }
    }
  }
}
