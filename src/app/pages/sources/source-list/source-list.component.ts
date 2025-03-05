import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';
import { SourceService } from '../sources.service';
import { IAgentSource } from '../models/sources.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { SlicePipe, DatePipe } from '@angular/common';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-source-list',
  imports: [CardModule, ButtonModule, DCFilterBarComponent, SpeedDialModule, SlicePipe, DatePipe, ChipModule],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceListComponent implements OnInit {
  sources: IAgentSource[] = [];

  getCustomButtons(item: any): MenuItem[] {
    return [
      {
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction('view', item),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.doAction('edit', item),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.doAction('delete', item),
      },
    ];
  }

  constructor(
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    private sourceService: SourceService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  public async doAction(action: string, item: any) {
    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.sourceService.deleteSource(item.id);
          this.sources = this.sources.filter(source => source.id !== item.id);
          this.toastService.success({
            title: 'Origen eliminado',
            subtitle: 'El origen ha sido eliminado correctamente',
          });
          this.cdr.detectChanges();
        }
        break;
      case 'edit':
        this.router.navigate(['./edit', item.id], { relativeTo: this.route });
        break;
    }
  }

  async ngOnInit(): Promise<void> {
    this.sources = await this.sourceService.getSources();
    this.cdr.detectChanges();
  }

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }
}
