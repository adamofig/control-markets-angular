import { ChangeDetectionStrategy, Component, Signal, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, EntityBaseListV2Component, QuickTableComponent } from '@dataclouder/ngx-core';
import { FlowService } from '../flows.service';
import { IAgentFlows } from '../models/flows.model';
import { AppUserService, IUserOrganization } from '../../../services/app-user.service';
import { RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { OrganizationSelectorComponent } from 'src/app/components/organization-selector/organization-selector.component';

@Component({
  selector: 'app-flow-list',
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
    MessageModule,
    OrganizationSelectorComponent,
  ],
  templateUrl: './flow-list.html',
  styleUrl: './flow-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowListComponent extends EntityBaseListV2Component<IAgentFlows> implements OnInit {
  protected override entityCommunicationService = inject(FlowService);
  private appUserService = inject(AppUserService);
  public currentOrganization: Signal<IUserOrganization | undefined>;

  constructor() {
    super();
    this.currentOrganization = this.appUserService.currentOrganization;

    // this.mongoState.query.filters = { orgId: this.currentOrganization()?.orgId };

    this.mongoState.query = { orgId: this.currentOrganization()?.orgId || this.appUserService.user()._id };
    this.mongoState.projection = {
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

  public reload() {
    debugger;
    this.mongoState.query = { orgId: this.currentOrganization()?.orgId || this.appUserService.user().id };
    console.log('Reloading with query:', this.mongoState.query);

    // this.filterConfig.filters = { orgId: this.currentOrganization()?.orgId };
    this.loadData();
  }
}
