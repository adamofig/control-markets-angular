import { Injectable } from '@angular/core';
import { IAgentCard } from '@dataclouder/conversation-system';
import { Endpoints } from 'src/app/core/enums';
import { HttpService } from 'src/app/services/http.service';
import { NotionExportType } from '../models/notion.models';

export type NotionDBResponse = {
  success: boolean;
  databases: { id: string; title: string; url: string; created_time: string }[];
  error?: string;
  count: number;
};

export type NotionPageResponse = {
  success: boolean;
  pages: { id: string; title: string; url: string; created_time: string }[];
  error?: string;
  count: number;
};

@Injectable({
  providedIn: 'root',
})
export class NotionService {
  constructor(private httpService: HttpService) {}

  public getDBAvailible(): Promise<NotionDBResponse> {
    return this.httpService.getDataFromService(Endpoints.Notion.ListDBs);
  }

  public getPagesAvailable(): Promise<NotionPageResponse> {
    return this.httpService.getDataFromService(Endpoints.Notion.ListPages);
  }

  public createNotionPage(card: IAgentCard): Promise<{ success: boolean; error: string; page: any }> {
    return this.httpService.getDataFromService(`${Endpoints.Notion.CreatePage}/${card.id}`);
  }

  public async getPageInSpecificFormat(pageId: string, format: NotionExportType): Promise<any> {
    const data = await this.httpService.getDataFromService(`${Endpoints.Notion.PageInSpecificFormat}/${pageId}?exportType=${format}`);
    return data;
  }

  public extractNotionPageId(url: string) {
    const notionIdRegex = /[a-f0-9]{32}(?=\?|$)/;
    const match = url.match(notionIdRegex);
    const notionId = match ? match[0] : null;
    if (!notionId) {
      // this.toastService.error({
      //   title: 'URL inválido',
      //   subtitle: 'Por favor ingresa una URL válida de Notion',
      // });
    }
    return notionId;
  }
}
