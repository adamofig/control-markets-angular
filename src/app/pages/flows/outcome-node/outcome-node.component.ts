import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { OutcomeDetailsComponent } from '../outcome-details/outcome-details';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow, DialogModule],
  templateUrl: './outcome-node.component.html',
  styleUrl: './outcome-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OutcomeNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  public dialogService = inject(DialogService);

  @ViewChild('dialog') dialog!: ViewContainerRef;
  constructor() {
    super();
    effect(() => {
      console.log('outcome-node', this.data()?.text);
    });
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;
    this.dialogService.open(OutcomeDetailsComponent, {
      header: 'Outcome Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
    });
  }
}
