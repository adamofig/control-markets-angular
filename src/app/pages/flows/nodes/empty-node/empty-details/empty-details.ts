import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-empty-details',
  templateUrl: './empty-details.html',
  styleUrls: ['./empty-details.css'],
  standalone: true,
  imports: [CommonModule, JsonPipe],
})
export class EmptyDetailsComponent implements OnInit {
  public data: any;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.data = this.config.data;
  }
}
