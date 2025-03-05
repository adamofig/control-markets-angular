import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Endpoints } from '../../core/enums';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private httpService: HttpService) {}

  public async donwloadSong(url: string) {
    return this.httpService.getDataFromService<any>(Endpoints.Tools.DownloadYoutubeSong);
  }
}
