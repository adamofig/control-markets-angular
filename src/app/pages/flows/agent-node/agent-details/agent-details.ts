import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
// import {  } from '@dataclouder/ngx-agent-cards';

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

  // Creo que necesito el método defaultAgen service para obtern los datos
  // private agentService = inject(AgentService);

  constructor() {
    console.log('agent-details', this.dynamicDialogConfig.data);
  }

  ngOnInit(): void {
    console.log('agent-details', this.dynamicDialogConfig.data);
    this.dynamicDialogConfig.data;
  }

  public startFlow(): void {}
}
