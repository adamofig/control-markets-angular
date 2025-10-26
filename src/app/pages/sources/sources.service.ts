import { Injectable } from '@angular/core';
import { Endpoints } from '../../core/enums';
import { IAgentSource } from './models/sources.model';
import { FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class SourceService extends EntityCommunicationService<IAgentSource> {
  constructor() {
    super('agent-sources');
  }

  public async getYoutubeContent(url: string) {
    return this.httpService.getHttp<string>({
      service: `api/agent-sources/youtube-transcript?url=${url}`,
    });
  }

  public async getTiktokData(relationId: string) {
    return this.httpService.getHttp<string>({
      service: `api/agent-sources/tiktok-data/${relationId}`,
    });
  }
}
