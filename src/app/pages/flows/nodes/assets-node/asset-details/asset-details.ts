import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.html',
  styleUrls: ['./asset-details.css'],
  standalone: true,
  imports: [CommonModule, JsonPipe],
})
export class AssetDetailsComponent implements OnInit {
  public data: any;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    // node.data contains both 'config' (metadata) and 'nodeData' (business data)
    this.data = this.config.data?.data?.nodeData;
  }
}
