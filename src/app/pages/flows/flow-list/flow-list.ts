import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, QuickTableComponent } from '@dataclouder/ngx-core';
import { FlowService } from '../flows.service';
import { IAgentFlows } from '../models/flows.model';
import { RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { EntityBaseListComponent } from '@dataclouder/ngx-core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-generic-list',
  imports: [
    CardModule,
    ButtonModule,
    DCFilterBarComponent,
    SpeedDialModule,
    DatePipe,
    SlicePipe,
    PaginatorModule,
    RouterModule,
    TableModule,
    QuickTableComponent,
    TagModule,
  ],
  templateUrl: './flow-list.html',
  styleUrl: './flow-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowListComponent extends EntityBaseListComponent<IAgentFlows> implements OnInit {
  protected override entityCommunicationService = inject(FlowService);

  constructor() {
    super();
    this.filterConfig.returnProps = {
      _id: 1,
      id: 1,
      name: 1,
      description: 1,
      createdAt: 1,
      updatedAt: 1,
      metadata: 1,
    };
  }

  getCustomButtons(item: any): MenuItem[] {
    return [
      {
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction({ item, action: 'view' }),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.doAction({ item, action: 'edit' }),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.doAction({ item, action: 'delete' }),
      },
    ];
  }
}
