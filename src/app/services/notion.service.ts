import { Injectable, inject } from '@angular/core';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { NotionAbstractService, NotionDBResponse, NotionExportType, NotionPageResponse } from '@dataclouder/ngx-lessons';
import { HttpCoreService } from '@dataclouder/ngx-core';

const Endpoints = {
  Notion: {
    ListDBs: 'api/notion/db',
    ListPages: 'api/notion/pages',
    CreatePage: 'api/notion/page',
    PageInSpecificFormat: 'api/notion/page-in-specific-format',
  },
};
@Injectable({
  providedIn: 'root',
})
export class NotionService implements NotionAbstractService {
  private httpService = inject(HttpCoreService);

  public getDBAvailible(): Promise<NotionDBResponse> {
    return this.httpService.get<NotionDBResponse>(Endpoints.Notion.ListDBs);
  }

  public getPagesAvailable(): Promise<NotionPageResponse> {
    return this.httpService.get<NotionPageResponse>(Endpoints.Notion.ListPages);
  }

  public createNotionPage(card: IAgentCard): Promise<{ success: boolean; error: string; page: any }> {
    return this.httpService.post<{ success: boolean; error: string; page: any }>(Endpoints.Notion.CreatePage, card);
  }

  public async getPageInSpecificFormat(pageId: string, format: NotionExportType): Promise<any> {
    const data = await this.httpService.get<{ success: boolean; error: string; page: any }>(
      `${Endpoints.Notion.PageInSpecificFormat}/${pageId}?exportType=${format}`
    );
    return data;
  }
}
