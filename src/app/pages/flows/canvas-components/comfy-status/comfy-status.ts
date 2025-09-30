import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { APP_CONFIG, HttpCoreService } from '@dataclouder/ngx-core';

interface ServerStatus {
  device: string;
  memory: {
    used: number;
    free: number;
    total: number;
  };
  so: string;
}

interface StatusResponse {
  status: string;
  numAvailable: number;
  servers: ServerStatus[];
}

@Component({
  selector: 'app-comfy-status',
  standalone: true,
  imports: [TagModule, CommonModule],
  templateUrl: './comfy-status.html',
  styleUrls: ['./comfy-status.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComfyStatusComponent implements OnInit {
  public status = signal<StatusResponse | null>(null);
  private appConfig = inject(APP_CONFIG);

  async ngOnInit(): Promise<void> {
    setInterval(async () => {
      await this.getStatus();
    }, 6000);
  }

  public async getStatus() {
    try {
      const status = await this.httpCoreService.getHttp({
        host: this.appConfig.aiServicesUrl || this.appConfig.backendNodeUrl,
        service: 'api/comfy-sdk/status',
      });
      this.status.set(status);
    } catch (error) {
      console.error('Not able to get status');
    }
  }

  public httpCoreService = inject(HttpCoreService);
}
