import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/core/enums';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class TiktokService {
  constructor(private httpService: HttpService) {}

  public getTiktoksAvailibleUsers() {
    return this.httpService.getDataFromService('api/video-analizer/tiktok/availible-users', 'python');
  }

  public getTiktoksByUser(user: string) {
    return this.httpService.getDataFromService(`api/video-analizer/tiktok/user-data?user_id=${user}`, 'python');
  }

  public getSourceAnalysis(videoPlatformId: string) {
    return this.httpService.getDataFromService(`/api/video-analizer/video-agent-source/${videoPlatformId}`, 'python');
  }

  //   public extractInfo(urls: string[]) {
  //     return this.httpService.postDataToService('api/video-analizer/extract-tiktok-data', { urls }, 'python');
  //   }
}
