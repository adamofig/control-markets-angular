import { Injectable } from '@angular/core';
import { Endpoints } from '../../core/enums';
import { IAgentSource } from './models/sources.model';
import { FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class SourceService extends EntityCommunicationService<IAgentSource> {
  public async getSources() {
    return this.httpService.get<IAgentSource[]>(Endpoints.Sources.Source);
  }

  public async getFilteredSources(filterConfig: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IAgentSource>>(Endpoints.Sources.QuerySources, filterConfig);
  }

  public async getSource(id: string) {
    return this.httpService.get<IAgentSource>(`${Endpoints.Sources.Source}/${id}`);
  }

  public async saveSource(source: IAgentSource) {
    return this.httpService.post<IAgentSource>(Endpoints.Sources.Source, source);
  }

  public async updateSource(id: string, source: Partial<IAgentSource>) {
    return this.httpService.put<IAgentSource>(`${Endpoints.Sources.Source}/${id}`, source);
  }

  public async deleteSource(id: string) {
    return this.httpService.delete(`${Endpoints.Sources.Source}/${id}`);
  }

  public async getYoutubeContent(url: string) {
    return this.httpService.get<string>(`${Endpoints.Sources.YoutubeTranscript}?url=${url}`);
  }

  public async getTiktokData(relationId: string) {
    return this.httpService.get<string>(`${Endpoints.VideoAnalysis.TiktokData}/${relationId}`, 'secondary');
  }
}
