import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Endpoints } from '../../core/enums';
import { IAgentSource } from './models/sources.model';
import { FiltersConfig, IFilterQueryResponse } from '@dataclouder/core-components';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  constructor(private httpService: HttpService) {}

  public async getSources() {
    return this.httpService.getDataFromService<IAgentSource[]>(Endpoints.Sources.Source);
  }

  public async getFilteredSources(filterConfig: FiltersConfig) {
    return this.httpService.postDataToService<IFilterQueryResponse<IAgentSource>>(Endpoints.Sources.QuerySources, filterConfig);
  }

  public async getSource(id: string) {
    return this.httpService.getDataFromService<IAgentSource>(`${Endpoints.Sources.Source}/${id}`);
  }

  public async saveSource(source: IAgentSource) {
    return this.httpService.postDataToService<IAgentSource>(Endpoints.Sources.Source, source);
  }

  public async deleteSource(id: string) {
    return this.httpService.deleteDataFromService(`${Endpoints.Sources.Source}/${id}`);
  }

  public async getYoutubeContent(url: string) {
    return this.httpService.getDataFromService<string>(`${Endpoints.Sources.YoutubeTranscript}?url=${url}`);
  }

  public async getTiktokData(relationId: string) {
    return this.httpService.getDataFromService<string>(`${Endpoints.VideoAnalysis.TiktokData}/${relationId}`, 'python');
  }
}
