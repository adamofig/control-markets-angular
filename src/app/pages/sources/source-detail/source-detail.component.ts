import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourceService } from '../sources.service';
import { IAgentSource, SourceType } from '../models/sources.model';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastAlertService } from 'src/app/services/toast.service';
import { VideoAnalizerService } from '../../video-analizer/video-analizer.service';

@Component({
  selector: 'app-source-detail',
  imports: [DividerModule, ButtonModule],
  templateUrl: './source-detail.component.html',
  styleUrl: './source-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceDetailComponent {
  public sourceType = SourceType;
  public sourceId: string = this.route.snapshot.params['id'];
  public source: IAgentSource | null = null;
  private pollingInterval: any;
  private pollCount: number = 0;

  public additionalData: any;

  public statusHistory: string[] = [];

  public tiktokDataLoading: boolean = false;

  constructor(
    private videoAnalizerService: VideoAnalizerService,
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastAlertService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateSource();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  public async updateSource() {
    const source = await this.sourceService.getSource(this.sourceId);
    if (this.source?.statusDescription !== source.statusDescription) {
      this.statusHistory.push(source.statusDescription);
    }
    this.source = source;
    if (this.source?.relationId && !this.additionalData && !this.tiktokDataLoading) {
      this.tiktokDataLoading = true;
      this.sourceService.getTiktokData(this.source?.relationId).then(data => {
        this.additionalData = data;
        this.tiktokDataLoading = false;
      });
    }
    this.cdr.detectChanges();
  }

  private startPolling(): void {
    this.pollCount = 0;
    this.pollingInterval = setInterval(async () => {
      this.pollCount++;
      await this.updateSource();

      // Stop polling if source is finished or we've reached 15 attempts
      if ((this.source && this.source.status === 'finished') || this.pollCount >= 15) {
        this.stopPolling();
      }
    }, 1000); // Poll every second
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private summarizeTikTokVideo(tiktok: any) {
    // Basic video information
    const summary = {
      // Basic info (assuming these properties exist in the full object)
      title: tiktok.desc || 'No description',
      authorName: tiktok.author?.nickname || 'Unknown author',
      authorUsername: tiktok.author?.unique_id || 'Unknown username',

      // Statistics (assuming these exist in the full object)
      viewCount: tiktok.statistics?.play_count || 0,
      likeCount: tiktok.statistics?.digg_count || 0,
      commentCount: tiktok.statistics?.comment_count || 0,
      shareCount: tiktok.statistics?.share_count || 0,

      // Content information
      contentType: tiktok.content_type || 'Unknown',
      contentSizeType: tiktok.content_size_type,
      contentOriginalType: tiktok.content_original_type,
      shootTabName: tiktok.shoot_tab_name,

      // Music information
      musicVolume: parseFloat(tiktok.music_volume) || 0,
      musicInfo: {
        title: tiktok.music?.title || 'No music title',
        author: tiktok.music?.author || 'Unknown artist',
        duration: tiktok.music?.duration || 0,
        coverUrl: tiktok.music?.cover_large?.url_list?.[0] || null,
      },

      // AI generated content info
      isAIGenerated: tiktok.aigc_info?.aigc_label_type > 0,
      aigcLabelType: tiktok.aigc_info?.aigc_label_type,

      // Other potentially useful info
      hasDanmaku: tiktok.has_danmaku || false,
      supportsDanmaku: tiktok.support_danmaku || false,
    };

    return summary;
  }

  public downloadVideo() {
    const videoUrl = this.source?.video?.video?.url;
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  }

  public copyUrl() {
    const videoUrl = this.source?.video?.video?.url;
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      this.toastService.success({ title: 'Video URL copied to clipboard', subtitle: 'You can paste it in your browser' });
    }
  }

  public async processVideo() {
    // await this.videoAnalizerService.startAnalyzeVideo();
  }
}
