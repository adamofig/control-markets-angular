import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { LeadService } from '../leads.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ILead } from '../models/leads.model';

@Component({
  selector: 'app-lead-detail',
  imports: [JsonPipe],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadDetailComponent implements OnInit {
  private leadService = inject(LeadService);
  private activatedRoute = inject(ActivatedRoute);

  public leadId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public lead = signal<ILead | null>(null);

  ngOnInit(): void {
    this.loadLead();
  }

  private async loadLead() {
    const lead = await this.leadService.findOne(this.leadId);
    this.lead.set(lead);
  }
}
