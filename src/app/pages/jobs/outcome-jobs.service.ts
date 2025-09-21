import { Injectable, inject } from '@angular/core';
import { IAgentOutcomeJob } from './models/jobs.model';
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

  public async getJobs(): Promise<IAgentOutcomeJob[]> {
    try {
      const response = await this.httpService.get<IAgentOutcomeJob[]>(Endpoints.Jobs.Jobs, server);
      this.toastService.success({ title: 'Se han encontrado jobs', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching jobs', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredJobs(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IAgentOutcomeJob>>(Endpoints.Jobs.JobsFiltered, filter, server);
  }

  public async getOutcomeJob(id: string): Promise<IAgentOutcomeJob> {
    return this.httpService.get<IAgentOutcomeJob>(`${Endpoints.Jobs.Jobs}/${id}`);
  }

  public async saveJob(job: IAgentOutcomeJob): Promise<IAgentOutcomeJob> {
    return this.httpService.post<IAgentOutcomeJob>(Endpoints.Jobs.Jobs, job);
  }

  public async deleteJob(id: string) {
    return this.httpService.delete(`${Endpoints.Jobs.Jobs}/${id}`);
  }

  public async distributeJob(id: string, channel: string) {
    const payload = { id, channel };
    return this.httpService.post(`${Endpoints.Distribution.Channels}`, payload);
  }
}
