import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Endpoints } from '../../../core/enums';
import { IVideoProjectGenerator } from '../models/videoGenerators.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { ToastAlertService } from 'src/app/services/toast.service';
import { AgentCardService } from 'src/app/services/agent-cards.service';
@Injectable({
  providedIn: 'root',
})
export class VideoGeneratorService {
  constructor(
    private httpService: HttpService,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertService,
    private agentCardService: AgentCardService
  ) {}

  public async getVideoGenerators(): Promise<IVideoProjectGenerator[]> {
    try {
      const response = await this.httpService.getDataFromService(Endpoints.VideoGenerators.VideoGenerator);
      this.toastService.success({ title: 'Se han encontrado videoGenerators', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching videoGenerators', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredVideoGenerators(filter: FiltersConfig) {
    return this.httpService.postDataToService<IFilterQueryResponse<IVideoProjectGenerator>>(Endpoints.VideoGenerators.VideoGeneratorsFiltered, filter);
  }

  public async getVideoGenerator(id: string): Promise<IVideoProjectGenerator> {
    return this.httpService.getDataFromService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}`);
  }

  public async saveVideoGenerator(videoGenerator: IVideoProjectGenerator): Promise<IVideoProjectGenerator> {
    return this.httpService.postDataToService(Endpoints.VideoGenerators.VideoGenerator, videoGenerator);
  }

  public async deleteVideoGenerator(id: string) {
    return this.httpService.deleteDataFromService(`${Endpoints.VideoGenerators.VideoGenerator}/${id}`);
  }

  public async addSource(id: string, sourceId: string) {
    return this.httpService.patchDataToService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}/add-source/${sourceId}`);
  }

  public async removeSource(id: string, sourceId: string) {
    return this.httpService.patchDataToService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}/remove-source/${sourceId}`);
  }

  public async getAndSaveBestFragments(instructions: string) {
    const response = await this.agentCardService.callInstruction(instructions, { provider: 'google' });
    console.log(response);
    return response;
    // const response = await this.agentCardService.callChatCompletion({ messages });
    // return this.httpService.postDataToService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}/get-best-fragments`, { instructions });
  }
}
