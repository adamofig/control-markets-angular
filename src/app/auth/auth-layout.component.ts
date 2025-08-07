import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { AppConfigService } from '../services/app-config.service';

@Component({
  selector: 'app-auth-layout',
  template: `
    <div class="main-content">
      <div>
        <h1 class="title">
          <img routerLink="/" style="width: 200px" src="assets/app_icons/apiglota.svg" alt="Logo" />
        </h1>
      </div>

      <p-card>
        <router-outlet></router-outlet>
      </p-card>

      <p class="info-version">{{ envName }} {{ version }}</p>
    </div>
  `,
  styles: [
    `
      .main-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
      }
      .title {
        margin-bottom: 2rem;
      }
      .info-version {
        position: absolute;
        bottom: 1rem;
        font-size: 0.8rem;
        color: #888;
      }
    `,
  ],
  standalone: true,
  imports: [RouterOutlet, RouterLink, CardModule],
})
export class AuthLayoutComponent {
  private appConfigService = inject(AppConfigService);

  public envName = this.appConfigService.config.envName;
  public version = this.appConfigService.config.version;
}
