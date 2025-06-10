import { Injectable, inject } from '@angular/core';
import { IAgentJob } from './models/jobs.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN, HttpCoreService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  Jobs: {
    Jobs: 'api/agent-jobs',
    JobsFiltered: 'api/agent-jobs/query',
  },
  Distribution: {
    Channels: 'api/agent-distribution-channels',
  },
};

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private httpService = inject(HttpCoreService);
  private toastService = inject(TOAST_ALERTS_TOKEN);

  public async getJobs(): Promise<IAgentJob[]> {
    try {
      const response = await this.httpService.get<IAgentJob[]>(Endpoints.Jobs.Jobs, server);
      this.toastService.success({ title: 'Se han encontrado jobs', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching jobs', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredJobs(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IAgentJob>>(Endpoints.Jobs.JobsFiltered, filter, server);
  }

  public async getJob(id: string): Promise<IAgentJob> {
    return this.httpService.get<IAgentJob>(`${Endpoints.Jobs.Jobs}/${id}`);
  }

  public async saveJob(job: IAgentJob): Promise<IAgentJob> {
    return this.httpService.post<IAgentJob>(Endpoints.Jobs.Jobs, job);
  }

  public async deleteJob(id: string) {
    return this.httpService.delete(`${Endpoints.Jobs.Jobs}/${id}`);
  }

  public async distributeJob(id: string, channel: string) {
    const payload = { id, channel };
    return this.httpService.post(`${Endpoints.Distribution.Channels}`, payload);
  }
}
