import { Component, inject } from '@angular/core';

import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonText, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/core/enums';
import { environment } from 'src/environments/environment';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [IonImg, IonText, IonIcon, IonButton, IonTitle, IonButtons, IonToolbar, IonHeader, IonContent],
})
export class LandingComponent {
  private router = inject(Router);
  private appConfigService = inject(AppConfigService);

  projectName = this.appConfigService.config.projectName;
  version = this.appConfigService.config.version;
  envName = this.appConfigService.config.envName;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  public goToSignup() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signup]);
  }

  public goToSignin() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signin]);
  }

  public goTo() {}
}
