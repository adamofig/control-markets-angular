import { Injectable, inject } from '@angular/core';
import { GenericType, IGeneric } from './models/generics.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN, HttpCoreService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  Generics: {
    Generics: 'api/generic',
    GenericsFiltered: 'api/generic/query',
  },
};

const RemoveSimpleDataExample = [
  { id: '1', name: 'Generic 1', description: 'Description with short description', type: GenericType.Gen1 },
  {
    id: '2',
    name: 'Generic 2',
    description:
      'Description  with a Medium description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: GenericType.Gen2,
  },
  {
    id: '3',
    name: 'Generic 3',
    description:
      'Description  with a long description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: GenericType.Gen3,
  },
];
@Injectable({
  providedIn: 'root',
})
export class GenericService {
  private httpService = inject(HttpCoreService);
  private toastService = inject(TOAST_ALERTS_TOKEN);

  public async getGenerics(): Promise<IGeneric[]> {
    try {
      const response = await this.httpService.get<IGeneric[]>(Endpoints.Generics.Generics, server);
      this.toastService.success({ title: 'Se han encontrado generics', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching generics', subtitle: 'Showing Default Data' });
      return RemoveSimpleDataExample;
    }
  }

  public async getFilteredGenerics(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IGeneric>>(Endpoints.Generics.GenericsFiltered, filter, server);
  }

  public async getGeneric(id: string): Promise<IGeneric> {
    return this.httpService.get<IGeneric>(`${Endpoints.Generics.Generics}/${id}`);
  }

  public async saveGeneric(generic: IGeneric): Promise<IGeneric> {
    return this.httpService.post<IGeneric>(Endpoints.Generics.Generics, generic);
  }

  public async deleteGeneric(id: string) {
    return this.httpService.delete(`${Endpoints.Generics.Generics}/${id}`);
  }
}
