import { Injectable } from '@angular/core';
import { IOrganization } from './models/organizations.model';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

const Endpoints = 'organization';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends EntityCommunicationService<IOrganization> {
  constructor() {
    super(Endpoints);
  }

  public addUserToOrganization(organizationId: string, userEmail: string) {
    const payload = { email: userEmail };
    return this.httpService.postHttp({ service: `api/${Endpoints}/${organizationId}/add-user`, data: payload });
  }
}
