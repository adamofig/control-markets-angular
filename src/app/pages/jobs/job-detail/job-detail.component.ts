import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { JobService } from '../jobs.service';
import { IAgentJob } from '../models/jobs.model';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { N8nService } from 'src/app/services/n8n.service';

@Component({
  selector: 'app-job-detail',
  imports: [JsonPipe, AccordionModule, CardModule, DividerModule, ButtonModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDetailComponent implements OnInit {
  private genericService = inject(JobService);
  private activatedRoute = inject(ActivatedRoute);
  private n8nService = inject(N8nService);

  public jobId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public job = signal<IAgentJob | null>(null);

  ngOnInit(): void {
    this.loadJob();
  }

  private async loadJob() {
    const job = await this.genericService.getJob(this.jobId);
    this.job.set(job);
  }

  public async distribute(channel: string) {
    await this.n8nService.startGithubFlow(this.jobId);
    // await this.genericService.distributeJob(this.jobId, channel);
    debugger;
    this.loadJob();
  }
}
