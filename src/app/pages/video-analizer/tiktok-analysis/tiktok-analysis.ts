import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TiktokService } from '../tiktoks/tiktok.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-source-form',
  imports: [ButtonModule, TableModule, DatePipe],
  templateUrl: './tiktok-analysis.html',
  styleUrl: './tiktok-analysis.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiktokAnalysisComponent {
  constructor(
    @Inject(TOAST_ALERTS_TOKEN) private toastAlerts: ToastAlertsAbstractService,
    private tiktokService: TiktokService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public user: string = '';

  public products: any[] = [
    {
      code: '1000',
      name: 'Product 1',
      category: 'Category 1',
      quantity: 100,
    },
  ];

  public generateAnalysis() {
    this.tiktokService.getTiktoksAvailibleUsers
    // this.router.navigate([`../`], { relativeTo: this.route });
  }
}
