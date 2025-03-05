import { Injectable } from '@angular/core';
import { UserDataExchange, UserDataExchangeAbstractService } from '@dataclouder/conversation-system';
import { Endpoints } from 'src/app/core/enums';
import { HttpService } from 'src/app/services/http.service';
import { IAgentTask } from '../models/tasks-models';
import { FiltersConfig, IFilterQueryResponse } from '@dataclouder/core-components';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private httpService: HttpService) {}

  public getTasks() {
    return this.httpService.getDataFromService(Endpoints.Tasks.List);
  }

  public getFilteredTasks(filters: FiltersConfig): Promise<IFilterQueryResponse<IAgentTask>> {
    return this.httpService.postDataToService(Endpoints.Tasks.Query, filters);
  }

  public getTaskById(id: string): Promise<IAgentTask> {
    return this.httpService.getDataFromService(`${Endpoints.Tasks.Task}/${id}`);
  }

  public saveTask(task: IAgentTask) {
    return this.httpService.postDataToService(Endpoints.Tasks.Save, task);
  }

  public deleteTask(id: string) {
    return this.httpService.deleteDataFromService(`${Endpoints.Tasks.Task}/${id}`);
  }

  public executeTask(id: string) {
    return this.httpService.getDataFromService(`${Endpoints.Tasks.Execute}/${id}`);
  }
}
