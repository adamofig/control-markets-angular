import { Injectable } from '@angular/core';

import { HttpCoreService } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class TiktokService {
  constructor(private httpService: HttpCoreService) {}

  public getTiktoksAvailibleUsers() {
    return this.httpService.get('api/video-analizer/tiktok/availible-users');
  }

  public getTiktoksByUser(user: string) {
    return this.httpService.get(`api/video-analizer/tiktok/user-data?user_id=${user}`);
  }

  public getSourceAnalysis(videoPlatformId: string) {
    return this.httpService.get(`/api/video-analizer/video-agent-source/${videoPlatformId}`);
  }

  //   public extractInfo(urls: string[]) {
  //     return this.httpService.postDataToService('api/video-analizer/extract-tiktok-data', { urls }, 'python');
  //   }
}
