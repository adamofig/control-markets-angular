import { Injectable } from '@angular/core';
import { HttpCoreService } from '@dataclouder/ngx-core';
import { Endpoints } from '../../core/enums';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private httpService: HttpCoreService) {}

  public async donwloadSong(url: string) {
    return this.httpService.get<any>(Endpoints.Tools.DownloadYoutubeSong);
  }
}
