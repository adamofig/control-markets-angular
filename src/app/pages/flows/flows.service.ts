import { Injectable, inject } from '@angular/core';
import { IFlow } from './models/generics.model';
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

  public async getFlows(): Promise<IFlow[]> {
    try {
      const response = await this.httpService.get<IFlow[]>(Endpoints.Generics.Generics, server);
      this.toastService.success({ title: 'Se han encontrado generics', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching generics', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredFlows(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IFlow>>(Endpoints.Generics.GenericsFiltered, filter, server);
  }

  public async getFlow(id: string): Promise<IFlow> {
    return this.httpService.get<IFlow>(`${Endpoints.Generics.Generics}/${id}`);
  }

  public async saveFlow(flow: IFlow): Promise<IFlow> {
    return this.httpService.post<IFlow>(Endpoints.Generics.Generics, flow);
  }

  public async deleteFlow(id: string) {
    return this.httpService.delete(`${Endpoints.Generics.Generics}/${id}`);
  }
}
