import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Endpoints } from '../../../core/enums';
import { IVideoProjectGenerator } from '../models/video-project.model';
import { EntityCommunicationService, FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { ToastAlertService } from 'src/app/services/toast.service';
import { AgentCardService } from 'src/app/services/agent-cards.service';

const ENDPOINTS_videoGenerator = 'video-generator';
@Injectable({
  providedIn: 'root',
})
export class VideoGeneratorService extends EntityCommunicationService<IVideoProjectGenerator> {
  constructor(@Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertService, private agentCardService: AgentCardService) {
    super(ENDPOINTS_videoGenerator);
  }

  public async getVideoGenerators(): Promise<IVideoProjectGenerator[]> {
    try {
      const response = await this.findAll();
      this.toastService.success({ title: 'Se han encontrado videoGenerators', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching videoGenerators', subtitle: 'Showing Default Data' });
      return [];
    }
  }

  public async getFilteredVideoGenerators(filter: FiltersConfig) {
    return this.query(filter);
  }

  public async getVideoGenerator(id: string): Promise<IVideoProjectGenerator> {
    return this.findOne(id);
  }

  public async saveVideoGenerator(videoGenerator: IVideoProjectGenerator): Promise<IVideoProjectGenerator> {
    return this.createOrUpdate(videoGenerator);
  }

  public async updateVideoGenerator(id: string, videoGenerator: Partial<IVideoProjectGenerator>): Promise<IVideoProjectGenerator> {
    // return this.update(id, videoGenerator);
    return null as any;
  }

  public async addAgent(VideoProjectId: string, agentId: string) {
    const data = 'add-agent-card';
    // return this.patchDataToService(Endpoints.VideoGenerators.VideoGenerator + `/${VideoProjectId}/add-agent-card/${agentId}`);
    return null as any;
  }

  public async partialUpdateVideoGenerator(id: string, videoGenerator: Partial<IVideoProjectGenerator>): Promise<IVideoProjectGenerator> {
    // return this.patchDataToService(Endpoints.VideoGenerators.VideoGenerator + `/${id}`, videoGenerator);
    return null as any;
  }

  public async deleteVideoGenerator(id: string) {
    return this.remove(id);
  }

  public async addSource(id: string, sourceId: string) {
    // return this.patchDataToService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}/add-source/${sourceId}`);
  }

  public async removeSource(id: string, sourceId: string) {
    // return this.patchDataToService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}/remove-source/${sourceId}`);
  }

  public async getAndSaveBestFragments(instructions: string) {
    const response = await this.agentCardService.callInstruction(instructions);
    console.log(response);
    return response;
    // const response = await this.agentCardService.callChatCompletion({ messages });
    // return this.httpService.postDataToService<IVideoProjectGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}/get-best-fragments`, { instructions });
  }
}
