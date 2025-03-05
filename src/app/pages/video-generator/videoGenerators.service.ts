import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Endpoints } from '../../core/enums';
import { VideoGeneratorype, IVideoGenerator } from './models/videoGenerators.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN } from '@dataclouder/core-components';
import { ToastAlertService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class VideoGeneratorService {
  constructor(private httpService: HttpService, @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertService) {}

  public async getVideoGenerators(): Promise<IVideoGenerator[]> {
    try {
      const response = await this.httpService.getDataFromService(Endpoints.VideoGenerators.VideoGenerator);
      this.toastService.success({ title: 'Se han encontrado videoGenerators', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching videoGenerators', subtitle: 'Showing Default Data' });
      return [
        { id: '1', name: 'VideoGenerator 1', description: 'Description with short description', type: VideoGeneratorype.Gen1 },
        {
          id: '2',
          name: 'VideoGenerator 2',
          description:
            'Description  with a Medium description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          type: VideoGeneratorype.Gen2,
        },
        {
          id: '3',
          name: 'VideoGenerator 3',
          description:
            'Description  with a long description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          type: VideoGeneratorype.Gen3,
        },
      ];
    }
  }

  public async getFilteredVideoGenerators(filter: FiltersConfig) {
    return this.httpService.postDataToService<IFilterQueryResponse<IVideoGenerator>>(Endpoints.VideoGenerators.VideoGeneratorsFiltered, filter);
  }

  public async getVideoGenerator(id: string): Promise<IVideoGenerator> {
    return this.httpService.getDataFromService<IVideoGenerator>(`${Endpoints.VideoGenerators.VideoGenerator}/${id}`);
  }

  public async saveVideoGenerator(videoGenerator: IVideoGenerator): Promise<IVideoGenerator> {
    return this.httpService.postDataToService(Endpoints.VideoGenerators.VideoGenerator, videoGenerator);
  }

  public async deleteVideoGenerator(id: string) {
    // return this.httpService.deleteDataFromService(`${Endpoints.Sources.Source}/${id}`);
  }
}
