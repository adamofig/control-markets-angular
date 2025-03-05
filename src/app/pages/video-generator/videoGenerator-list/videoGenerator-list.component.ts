import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, PaginationBase, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';
import { VideoGeneratorService } from '../videoGenerators.service';
import { IVideoGenerator } from '../models/videoGenerators.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-videoGenerator-list',
  imports: [CardModule, ButtonModule, DCFilterBarComponent, SpeedDialModule, DatePipe, SlicePipe],
  templateUrl: './videoGenerator-list.component.html',
  styleUrl: './videoGenerator-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO: extends PaginationBase this handle filter, pagination, and url params ?page=1
export class VideoGeneratorListComponent extends PaginationBase implements OnInit {
  videoGenerators: IVideoGenerator[] = [];

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
    private sourceService: VideoGeneratorService,
    router: Router,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super(route, router);
  }

  async ngOnInit(): Promise<void> {
    const response = await this.sourceService.getFilteredVideoGenerators(this.filterConfig);
    this.videoGenerators = response.rows;
    this.cdr.detectChanges();
  }

  protected override loadData(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async doAction(action: string, item: any) {
    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.sourceService.deleteVideoGenerator(item.id);
          this.videoGenerators = this.videoGenerators.filter(videoGenerator => videoGenerator.id !== item.id);
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

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }
}
