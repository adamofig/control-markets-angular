import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonFooter, IonApp } from '@ionic/angular/standalone';
import { APP_CONFIG } from '@dataclouder/ngx-core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stack-ionic',
  standalone: true,
  imports: [IonApp, IonFooter, IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, RouterOutlet],
  templateUrl: './stack-ionic.component.html',
  styleUrl: './stack-ionic.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackIonicComponent implements OnInit {
  private router = inject(Router);
  private appConfigService = inject(APP_CONFIG);

  public currentPath: string = ' ';

  public projectName = 'Pending project';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }
}
