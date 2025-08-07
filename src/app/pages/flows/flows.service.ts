import { Injectable, inject } from '@angular/core';
import { IAgentFlows } from './models/flows.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN, HttpCoreService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  Flows: {
    Flows: 'api/agent-flows',
    FlowsFiltered: 'api/agent-flows/query',
    ExecuteTask: 'api/agent-flows/run-node',
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
      const response = await this.httpService.get<IAgentFlows[]>(Endpoints.Flows.Flows, server);
      this.toastService.success({ title: 'Se han encontrado Flows', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching Flows', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredFlows(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IAgentFlows>>(Endpoints.Flows.FlowsFiltered, filter, server);
  }

  public async getFlow(id: string): Promise<IAgentFlows> {
    return this.httpService.get<IAgentFlows>(`${Endpoints.Flows.Flows}/${id}`);
  }

  public async saveFlow(flow: IAgentFlows): Promise<IAgentFlows> {
    return this.httpService.post<IAgentFlows>(Endpoints.Flows.Flows, flow);
  }

  public async deleteFlow(id: string) {
    return this.httpService.delete(`${Endpoints.Flows.Flows}/${id}`);
  }

  public async runFlow(flowid: string) {
    return this.httpService.post<IAgentFlows>(`${Endpoints.Flows.Flows}/run/${flowid}`, {});
  }

  public async runNode(flowId: string, nodeId: string) {
    // assummong node is a task
    return this.httpService.post<IAgentFlows>(`${Endpoints.Flows.ExecuteTask}`, { flowId, nodeId });
  }
}
