import { Component, inject } from '@angular/core';

import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonText, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/core/enums';
import { APP_CONFIG } from '@dataclouder/ngx-core';
import { CardModule } from 'primeng/card';
import { addIcons } from 'ionicons';
import { logoGithub } from 'ionicons/icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [IonImg, IonText, IonIcon, IonButton, IonTitle, IonButtons, IonToolbar, IonHeader, IonContent, CardModule],
})
export class LandingComponent {
  private router = inject(Router);
  private config = inject(APP_CONFIG);

  projectName = this.config.projectName;
  version = this.config.version;
  envName = this.config.envName;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    addIcons({ logoGithub });
  }

  public goToSignup() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signup]);
  }

  public goToSignin() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signin]);
  }

  public goToGithub() {
    window.open('https://github.com/adamofig/control-markets-angular', '_blank');
  }
}
