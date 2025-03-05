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
  templateUrl: './tiktoks-user.html',
  styleUrl: './tiktoks-user.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiktoksUserComponent implements OnInit {
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

  async ngOnInit(): Promise<void> {
    this.user = this.route.snapshot.params['id'];
    // this.availibleUsers = await this.tiktokService.getTiktoksAvailibleUsers();
    // console.log(this.availibleUsers);
    this.cdr.detectChanges();
    this.getTiktoksByUser();
  }

  public navigateTo(id: string) {
    this.router.navigate([`./${id}`], { relativeTo: this.route });
  }

  public async getTiktoksByUser() {
    this.products = await this.tiktokService.getTiktoksByUser(this.user);
    console.log(this.products);
    this.cdr.detectChanges();
  }

  public openTiktok(tiktok: any) {
    const titkokUrl = `https://www.tiktok.com/@${this.user}/video/${tiktok.aweme_id}`;
    window.open(titkokUrl, '_blank');
  }

  public openAnalysis(tiktok: any) {
    // const analysisUrl = `www.tiktok.com/@${this.user}/video/${tiktok.aweme_id}/analysis`;
    // window.open(analysisUrl, '_blank');
    this.router.navigate([`./analysis/${tiktok.aweme_id}`], { relativeTo: this.route });
  }
}
