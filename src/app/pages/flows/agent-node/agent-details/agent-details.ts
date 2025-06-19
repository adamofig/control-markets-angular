import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { DynamicNode } from 'ngx-vflow';

@Component({
  selector: 'app-distribution-chanel-details',
  imports: [ButtonModule, JsonPipe],
  templateUrl: './agent-details.html',
  styleUrl: './agent-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentDetailsComponent {
  public dynamicDialogConfig = inject(DynamicDialogConfig);

  public data!: IAgentCard;
  public node!: DynamicNode;

  // Creo que necesito el método defaultAgen service para obtern los datos
  // private agentService = inject(AgentService);

  constructor() {
    console.log('agent-details', this.dynamicDialogConfig.data);
  }

  ngOnInit(): void {
    console.log('agent-details', this.dynamicDialogConfig.data);
    this.data = this.dynamicDialogConfig.data.data;
    this.node = this.dynamicDialogConfig.data.node;
    debugger;
    console.log('agent-details', this.data, this.node);
  }

  public startFlow(): void {}
}
