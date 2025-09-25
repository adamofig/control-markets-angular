import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { HttpCoreService } from '@dataclouder/ngx-core';

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
  async ngOnInit(): Promise<void> {
    setInterval(async () => {
      await this.getStatus();
    }, 6000);
  }

  public async getStatus() {
    this.status.set(
      await this.httpCoreService.getHttp({
        host: 'http://localhost:3001',
        service: 'api/comfy-sdk/status',
      })
    );
  }

  public httpCoreService = inject(HttpCoreService);
}
