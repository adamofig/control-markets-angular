import { Injectable } from '@angular/core';
import { UserDataExchange, UserDataExchangeAbstractService } from '@dataclouder/ngx-agent-cards';
import { Endpoints } from 'src/app/core/enums';
import { IAgentTask } from '../models/tasks-models';
import { FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends EntityCommunicationService<IAgentTask> {
  constructor() {
    super('agent-tasks');
  }

  public getTasks() {
    return this.httpService.get(Endpoints.Tasks.List);
  }

  public getFilteredTasks(filters: FiltersConfig): Promise<IFilterQueryResponse<IAgentTask>> {
    return this.httpService.post(Endpoints.Tasks.Query, filters);
  }

  public getTaskById(id: string): Promise<IAgentTask> {
    return this.httpService.get(`${Endpoints.Tasks.Task}/${id}`);
  }

  public saveTask(task: Partial<IAgentTask>) {
    return this.httpService.post(Endpoints.Tasks.Save, task);
  }

  public deleteTask(id: string) {
    return this.httpService.delete(`${Endpoints.Tasks.Task}/${id}`);
  }

  public executeTask(id: string) {
    return this.httpService.get(`${Endpoints.Tasks.Execute}/${id}`);
  }
}
