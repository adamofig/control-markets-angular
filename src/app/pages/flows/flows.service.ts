import { Injectable, inject } from '@angular/core';
import { IAgentFlows } from './models/flows.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN, HttpCoreService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  Generics: {
    Generics: 'api/agent-flows',
    GenericsFiltered: 'api/agent-flows/query',
  },
};

@Injectable({
  providedIn: 'root',
})
export class FlowService {
  private httpService = inject(HttpCoreService);
  private toastService = inject(TOAST_ALERTS_TOKEN);

  public async getFlows(): Promise<IAgentFlows[]> {
    try {
      const response = await this.httpService.get<IAgentFlows[]>(Endpoints.Generics.Generics, server);
      this.toastService.success({ title: 'Se han encontrado generics', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching generics', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredFlows(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IAgentFlows>>(Endpoints.Generics.GenericsFiltered, filter, server);
  }

  public async getFlow(id: string): Promise<IAgentFlows> {
    return this.httpService.get<IAgentFlows>(`${Endpoints.Generics.Generics}/${id}`);
  }

  public async saveFlow(flow: IAgentFlows): Promise<IAgentFlows> {
    return this.httpService.post<IAgentFlows>(Endpoints.Generics.Generics, flow);
  }

  public async deleteFlow(id: string) {
    return this.httpService.delete(`${Endpoints.Generics.Generics}/${id}`);
  }
}
