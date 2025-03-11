import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourceService } from '../sources.service';
import { IAgentSource, SourceType } from '../models/sources.model';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastAlertService } from 'src/app/services/toast.service';
import { VideoAnalizerService, VideoAnalysisDto } from '../../video-analizer/video-analizer.service';
import { TagModule } from 'primeng/tag';
import { createTikTokStyleCaptions, Caption } from '@remotion/captions';
import { openAiWhisperApiToCaptions } from '@remotion/openai-whisper';
@Component({
  selector: 'app-source-detail',
  imports: [DividerModule, ButtonModule, TagModule],
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

  public loading = {
    videoProcessing: false,
    extractingVocals: false,
    extractingTranscription: false,
    extractingRemotionCaptions: false,
    tiktokDataLoading: false,
  };
  public additionalData: any;
  public statusHistory: string[] = [];

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
    if (this.source?.relationId && !this.additionalData && !this.loading.tiktokDataLoading) {
      this.loading.tiktokDataLoading = true;
      this.sourceService.getTiktokData(this.source?.relationId).then(data => {
        this.additionalData = data;
        this.loading.tiktokDataLoading = false;
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
    this.loading.videoProcessing = true;
    this.toastService.info({ title: 'Processing video', subtitle: 'Please wait...' });
    const result = await this.videoAnalizerService.startAnalyzeVideo({
      url: this.source?.sourceUrl ?? '',
      website: 'youtube',
      id: this.source?.id ?? '',
      options: {},
    });
    console.log('processVideo result, should i reaload?', result);
    this.loading.videoProcessing = false;
    this.cdr.detectChanges();
    this.toastService.success({ title: 'Video processed', subtitle: 'Video processed successfully' });
  }

  public extractFrames() {
    console.log('Generating frames', this.source);
    alert('Not implemented yet');
    // await this.videoAnalizerService.startGenerateFrames(this.source?.id);
  }

  public async extractAudio() {
    console.log('Generating audio', this.source);
    const params: VideoAnalysisDto = { url: this.source?.sourceUrl ?? '', website: 'youtube', id: this.source?.id ?? '', options: { only_audio: true } };
    await this.videoAnalizerService.startAnalyzeVideo(params);
  }

  public async extractVocals() {
    this.loading.extractingVocals = true;
    console.log('Extracting vocals', this.source);
    const params: VideoAnalysisDto = { url: this.source?.sourceUrl ?? '', website: 'youtube', id: this.source?.id ?? '', options: { only_vocals: true } };
    await this.videoAnalizerService.startAnalyzeVideo(params);
    this.loading.extractingVocals = false;
  }

  public async extractTranscription() {
    console.log('Extracting transcription', this.source);
    const params: VideoAnalysisDto = {
      url: this.source?.sourceUrl ?? '',
      website: 'youtube',
      id: this.source?.id ?? '',
      options: { only_transcription: true },
    };
    await this.videoAnalizerService.startAnalyzeVideo(params);
  }

  public async extractRemotionCaptions() {
    console.log('Extracting remotion captions', this.source);
    try {
      const captions = openAiWhisperApiToCaptions({ transcription: this.source?.video?.transcription });
      // Additional process becouse i don't like the precision of the timestamps
      captions.captions.forEach(caption => {
        caption.startMs = Math.round(caption.startMs);
        caption.endMs = Math.round(caption.endMs);
        caption.timestampMs = caption.timestampMs ? Math.round(caption.timestampMs) : null;
      });

      if (this.source?.video) {
        this.source.video.remotionCaptions = captions.captions;
        this.sourceService.saveSource(this.source);
        this.toastService.success({ title: 'Remotion captions extracted', subtitle: 'Remotion captions extracted successfully' });
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error extracting remotion captions', error);
      this.toastService.error({ title: 'Error extracting remotion captions', subtitle: `Error: ${error}` });
    }
    // const captions = createTikTokStyleCaptions(this.source?.video?.transcription);
    // const captions = transformWhisperIntoRemotionCaptions(this.source?.video?.transcription?.segments);
  }
}

function transformWhisperIntoRemotionCaptions(segments: any) {
  const captions = [];

  for (const item of segments) {
    if (item.text === '') {
      continue;
    }

    captions.push({
      text: captions.length === 0 ? item.text.trimStart() : item.text,
      startMs: Math.floor(item.start * 1000),
      endMs: Math.floor(item.end * 1000),
      timestampMs: Math.floor((item.start + item.end) / 2),
    });
  }
  console.log('saving in json');

  // const outPath = path.join(__dirname, 'public',  `${name}.json`);
  // fs.writeFileSync(outPath, JSON.stringify(captions, null, 2));

  return captions;
}
