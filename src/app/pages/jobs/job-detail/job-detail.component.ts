import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { JobService } from '../outcome-jobs.service';
import { IAgentOutcomeJob, ResponseFormat } from '../models/jobs.model';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { N8nService } from 'src/app/services/n8n.service';
import { MarkdownComponent } from 'ngx-markdown';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [JsonPipe, AccordionModule, CardModule, DividerModule, ButtonModule, MarkdownComponent, TagModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeJobDetailComponent implements OnInit {
  private genericService = inject(JobService);
  private activatedRoute = inject(ActivatedRoute);
  private n8nService = inject(N8nService);

  public responseFormat = ResponseFormat;

  public jobId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public job = signal<IAgentOutcomeJob | null>(null);
  @Input() jobInput: IAgentOutcomeJob | null = null;

  public resultWordCount = computed(() => {
    const currentJob = this.job();
    if (!currentJob?.result?.content) {
      return 0;
    }
    return currentJob.result.content.trim().split(/\s+/).length;
  });

  ngOnInit(): void {
    this.loadOutcomeJob();
  }

  private async loadOutcomeJob() {
    if (this.jobInput) {
      this.job.set(this.jobInput);
      return;
    }
    const job = await this.genericService.getOutcomeJob(this.jobId);
    this.job.set(job);
  }

  public async distribute(channel: string) {
    await this.n8nService.startGithubFlow(this.jobId);
    // await this.genericService.distributeJob(this.jobId, channel);

    this.loadOutcomeJob();
  }

  public getWordCount(text: string | undefined | null): number {
    if (!text) {
      return 0;
    }
    return text.trim().split(/\s+/).length;
  }
}
