import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, EntityBaseListV2Component, OnActionEvent, QuickTableComponent } from '@dataclouder/ngx-core';
import { LeadService } from '../leads.service';
import { ILead } from '../models/leads.model';
import { RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { UserService } from '@dataclouder/ngx-users';

@Component({
  selector: 'app-lead-list',
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
  templateUrl: './lead-list.component.html',
  styleUrl: './lead-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadListComponent extends EntityBaseListV2Component<ILead> implements OnInit {
  protected override entityCommunicationService = inject(LeadService);
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

  // public override doAction(actionEvent: OnActionEvent): any {
  //   
  //   if (actionEvent.action === 'changeView') {
  //     this.viewType.set('table');
  //   }
  //   if (actionEvent.action === 'filterChange') {
  //     this.updateQueryFromFilter(actionEvent.item);
  //   } else {
  //     super.doAction(actionEvent);
  //   }
  // }
}
