import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-outcome-details',
  imports: [Vflow, DialogModule, JsonPipe],
  templateUrl: './asset-generated-details.html',
  styleUrl: './asset-generated-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetGeneratedDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);

  constructor() {
    console.log(this.dynamicDialogConfig.data);
  }

  ngOnInit(): void {
    console.log(this.dynamicDialogConfig.data);
  }

  public startFlow(): void {
    console.log(this.dynamicDialogConfig.data);
  }
}
