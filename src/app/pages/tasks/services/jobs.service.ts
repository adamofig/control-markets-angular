import { Injectable } from '@angular/core';
import { UserDataExchange, UserDataExchangeAbstractService } from '@dataclouder/conversation-system';
import { Endpoints } from 'src/app/core/enums';
import { HttpService } from 'src/app/services/http.service';
import { IAgentJob, IAgentTask } from '../models/tasks-models';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  constructor(private httpService: HttpService) {}

  public getTasks() {
    return this.httpService.getDataFromService(Endpoints.Tasks.List);
  }

  public getJobsByTaskId(id: string) {
    return this.httpService.getDataFromService(`${Endpoints.Jobs.ByTask}/${id}`);
  }

  public saveJob(job: IAgentJob) {
    return this.httpService.postDataToService(Endpoints.Jobs.Save, job);
  }

  public deleteJob(id: string) {
    return this.httpService.deleteDataFromService(`${Endpoints.Jobs.Job}/${id}`);
  }

  public executeJob(id: string) {
    return this.httpService.getDataFromService(`${Endpoints.Jobs.Execute}/${id}`);
  }
}
