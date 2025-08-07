import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';

const Endpoints = {
  Workflows: {
    github: 'github',
  },
};
@Injectable({
  providedIn: 'root',
})
export class N8nService {
  private httpService = inject(HttpClient);
  private appConfigService = inject(AppConfigService);

  public async startGithubFlow(id: string): Promise<any> {
    // return await lastValueFrom(this.httpService.get(`${this.appConfigService.config.n8nUrl}/${Endpoints.Workflows.github}?jobId=${id}`));
  }
}
