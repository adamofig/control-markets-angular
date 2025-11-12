import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, EntityBaseListComponent, QuickTableComponent } from '@dataclouder/ngx-core';
import { OrganizationService } from '../organizations.service';
import { IOrganization } from '../models/organizations.model';
import { RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { UserService } from '@dataclouder/ngx-users';

@Component({
  selector: 'app-organization-list',
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
  ],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationListComponent extends EntityBaseListComponent<IOrganization> implements OnInit {
  protected override entityCommunicationService = inject(OrganizationService);
  public userService = inject(UserService);

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
