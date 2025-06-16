import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

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

  public async startGithubFlow(id: string): Promise<any> {
    return await lastValueFrom(this.httpService.get(`${environment.n8nUrl}/${Endpoints.Workflows.github}?id=${id}`));
  }
}
