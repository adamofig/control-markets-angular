import { inject, Injectable } from '@angular/core';
import { ILead } from './models/leads.model';
import { EntityCommunicationService, FiltersConfig, LoadingBarService } from '@dataclouder/ngx-core';
import { TasksService } from '../tasks/services/tasks.service';

import { LlmService } from '@dataclouder/ngx-ai-services';

const Endpoints = 'lead';

@Injectable({
  providedIn: 'root',
})
export class LeadService extends EntityCommunicationService<ILead> {
  private taskService = inject(TasksService);
  private llmService = inject(LlmService);
  private loadingBar = inject(LoadingBarService);
  constructor() {
    super(Endpoints);
  }

  public async extractNumberInformation(phoneNumber: string): Promise<any> {
    // 1) Get the Task

    const taskTime = await this.taskService.getTaskById('69330bf5c2011ed4eed31193');

    console.log(taskTime);

    const response = await this.llmService.callChatCompletion({
      messages: [
        {
          role: 'system',
          content: taskTime.prompt,
        },
        {
          role: 'user',
          content: phoneNumber,
        },
      ],
      returnJson: true,
    });

    console.log(response);
    return response.content;
  }

  // public async extractNumberInformationAndSave() {
  //   alert('Extract number information');
  //   const content = await this.leadService.extractNumberInformation();

  //   const response = await this.entityCommunicationService.partialUpdate(this.entity()?.id, { phoneNumberData: content });

  //   console.log(response);
  // }

  public async startPhoneExtractionAll() {
    // 1) Get all leads using Mongo Filter
    this.loadingBar.showProgressBar();
    const leads = await this.getAllLeadsNoPhone();
    const totalLeads = leads.length;
    let processedLeads = 0;

    if (leads.length > 0) {
      // Initialize progress to 0
      this.loadingBar.progress = 0;

      // 2) For each lead, extractNumberInformation
      // 3) Update lead with phone number
      for (const lead of leads) {
        const phoneNumberData = await this.extractNumberInformation(lead.phoneNumber as string);
        console.log(phoneNumberData);
        await this.partialUpdate(lead.id, { phoneNumberData });

        // Update progress
        processedLeads++;
        this.loadingBar.progress = Math.round((processedLeads / totalLeads) * 100);
      }
    } else {
      alert('No pending leads found');
    }
  }

  private async getAllLeadsNoPhone() {
    const filter: FiltersConfig = {
      filters: {
        phoneNumberData: { $exists: false },
      },
      rowsPerPage: 100,
    };
    const response = await this.query(filter);
    console.log(`Total leads: ${response.rows.length}`);
    return response.rows;
  }
}
