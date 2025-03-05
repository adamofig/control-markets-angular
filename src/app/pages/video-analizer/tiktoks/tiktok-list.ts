import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';
import { TiktokService } from './tiktok.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-source-form',
  imports: [ButtonModule],
  templateUrl: './tiktok-list.html',
  styleUrl: './tiktok-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiktokListComponent implements OnInit {
  constructor(
    @Inject(TOAST_ALERTS_TOKEN) private toastAlerts: ToastAlertsAbstractService,
    private tiktokService: TiktokService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public availibleUsers: any[] = [];

  async ngOnInit(): Promise<void> {
    try {
      this.availibleUsers = await this.tiktokService.getTiktoksAvailibleUsers();
      console.log(this.availibleUsers);
      this.cdr.detectChanges();
    } catch (error) {
      this.toastAlerts.error({ title: 'Error', subtitle: 'Error al obtener los tiktoks disponibles' });
    }
  }

  public navigateTo(id: string) {
    this.router.navigate([`./${id}`], { relativeTo: this.route });
  }
}
