import { Injectable } from '@angular/core';
import { ILead } from './models/leads.model';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

const Endpoints = 'lead';

@Injectable({
  providedIn: 'root',
})
export class LeadService extends EntityCommunicationService<ILead> {
  constructor() {
    super(Endpoints);
  }
}
