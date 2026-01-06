import { inject, Injectable } from '@angular/core';
import { Endpoints } from 'src/app/core/enums';
import { ILlmTask } from '../models/tasks-models';
import { APP_CONFIG, FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends EntityCommunicationService<ILlmTask> {
    private config = inject(APP_CONFIG);

  constructor() {
    super('agent-tasks');
  }

  public getTasks() {
    return this.httpService.getHttp({ service: Endpoints.Tasks.List });
  }

  public getFilteredTasks(filters: FiltersConfig): Promise<IFilterQueryResponse<ILlmTask>> {
    return this.httpService.postHttp({ service: Endpoints.Tasks.Query, data: filters });
  }

  public getTaskById(id: string): Promise<ILlmTask> {
    return this.httpService.getHttp({ host: this.config.backendNodeUrl, service: `${Endpoints.Tasks.Task}/${id}` });
  }

  public saveTask(task: Partial<ILlmTask>) {
    return this.httpService.postHttp({ host: this.config.backendNodeUrl, service: Endpoints.Tasks.Save, data: task });
  }

  public deleteTask(id: string) {
    return this.httpService.deleteHttp({ host: this.config.backendNodeUrl, service: `${Endpoints.Tasks.Task}/${id}` });
  }

  public executeTask(id: string) {
    return this.httpService.getHttp({ host: this.config.backendNodeUrl, service: `${Endpoints.Tasks.Execute}/${id}` });
  }
}
