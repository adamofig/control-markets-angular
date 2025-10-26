import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, EntityBaseListComponent, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { SourceService } from '../sources.service';
import { IAgentSource } from '../models/sources.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { SlicePipe, DatePipe } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { QuickTableComponent } from '@dataclouder/ngx-core';
import { TableModule } from 'primeng/table';
import { UserService } from '@dataclouder/ngx-users';

@Component({
  selector: 'app-source-list',
  imports: [
    CardModule,
    ButtonModule,
    DCFilterBarComponent,
    SpeedDialModule,
    SlicePipe,
    DatePipe,
    ChipModule,
    TagModule,
    PaginatorModule,
    QuickTableComponent,
    RouterModule,
    TableModule,
  ],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceListComponent extends EntityBaseListComponent<IAgentSource> implements OnInit {
  public userService = inject(UserService);
  protected override entityCommunicationService = inject(SourceService);

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
