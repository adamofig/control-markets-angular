import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ClipOverlay, CompositionProps, Overlay, OverlayType, CaptionOverlay } from './rve.models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SegFramesCalcPipe } from './seg-frames-calc.pipe';
import { JsonPipe } from '@angular/common';
import { IPlan, IVideoGenerator } from '../models/videoGenerators.model';
import { MarkdownModule } from 'ngx-markdown';
import { IAgentSource, IVideoSource } from '../../sources/models/sources.model';
import { createTikTokStyleCaptions, Caption, TikTokPage } from '@remotion/captions';
import { Caption as CaptionRVE } from './rve.models';

const FPS = 30;

@Component({
  selector: 'app-rve',
  imports: [TagModule, ButtonModule, SegFramesCalcPipe, JsonPipe, MarkdownModule],
  templateUrl: './rve.html',
  styleUrl: './rve.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RVEComponent implements OnInit {
  @Input() videoProject: IVideoGenerator | undefined | null = null;

  public OverlayType = OverlayType;
  public ganttChart: string = '';
  constructor(private cdr: ChangeDetectorRef) {}

  public overlays: Overlay[] = [];

  ngOnInit(): void {
    // const videoOverlay: Overlay = getVideoOverlay(this.videoProject as IVideoGenerator);

    // this.overlays.push(videoOverlay);
    // console.log('videoOverlay', videoOverlay);

    this.ganttChart = createGanttChart(this.videoProject?.plan);
    console.log('ganttChart', this.ganttChart);

    this.cdr.detectChanges();
  }

  public downloadComposition() {
    // Get the video overlays

    const youtubeSource = this.videoProject?.sources?.find(source => source.reference.type === 'youtube');
    if (!youtubeSource) throw new Error('No youtube source found');
    const videoOverlay: Overlay = getVideoOverlay(youtubeSource.reference);

    const captionsOverlay: Overlay = getCaptionsOverlay(youtubeSource.reference);

    const durationInSeconds = 20;
    const durationInFrames = durationInSeconds * FPS;

    const composition: CompositionProps = {
      overlays: [videoOverlay, captionsOverlay],
      durationInFrames: durationInFrames,
      width: 1920,
      height: 1080,
      fps: FPS,
    };
    this.downloadJson(composition, 'composition');
  }

  public downloadJson(jsonObject: Record<string, any>, fileName: string) {
    const jsonData = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export function createGanttChart(plan: IPlan | undefined): string {
  if (!plan) return '';
  const start = plan.extraction?.start || 0;
  const end = plan.extraction?.end || 0;
  console.log('start', start, 'end', end);

  const ganttChart = `
\`\`\`mermaid
gantt
    title Video Plan Timeline
    dateFormat s
    axisFormat %S

    section Videos
    Video 1           :v1, ${start}, ${end}s
    Video 2           :v2, after v1, 4s

    section Captions
    Captions 1     :s1, ${start}, ${end}s

    section Audio
    Song    :a1, ${start}, ${end}s
\`\`\``;

  console.log(ganttChart);

  return ganttChart;
}

function getCaptionsOverlay(videoSource: IAgentSource): CaptionOverlay {
  const captions = videoSource.video.remotionCaptions || [];

  const tikTokCaptions = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 2000,
  });

  const captionsRVE = tikTokCaptions.pages.map(remotionTiktokPageToCaptionRVE);
  console.log('Result of transform captionsRVE', captionsRVE);

  debugger;
  if (!captions.length) throw new Error('No captions source found');
  console.log('captions', captions);
  const captionsOverlay: CaptionOverlay = {
    id: 2,
    left: 53,
    top: 68,
    width: 964,
    height: 1780,
    durationInFrames: 20 * FPS,
    from: 0,
    captions: captionsRVE,
    type: OverlayType.CAPTION,
    row: 0,
    isDragging: false,
    rotation: 0,
  };
  return captionsOverlay as CaptionOverlay;
}

function remotionTiktokPageToCaptionRVE(page: TikTokPage): CaptionRVE {
  return {
    text: page.text,
    startMs: page.startMs,
    endMs: page.tokens.length > 0 ? page.tokens[page.tokens.length - 1].toMs : page.startMs,
    timestampMs: page.startMs,
    confidence: null,
    words: page.tokens.map(token => ({
      word: token.text,
      startMs: token.fromMs,
      endMs: token.toMs,
      confidence: 1, // Default confidence since TikTokPage tokens don't have confidence
    })),
  };
}

function getVideoOverlay(videoSource: IAgentSource): ClipOverlay {
  const durationInSeconds = 20;
  const offsetInSeconds = 5;
  const startSecond = 0;

  const videoOverlay = {
    id: 1,
    left: 53,
    top: 68,
    width: 964,
    height: 1780,
    // TIME IN FRAMES
    from: startSecond * FPS,
    durationInFrames: durationInSeconds * FPS,
    videoStartTime: offsetInSeconds * FPS,
    // TIME IN SECONDS
    _startSecond: startSecond,
    _durationInSeconds: durationInSeconds,
    _offsetInSeconds: offsetInSeconds,
    rotation: 0,
    row: 0,
    isDragging: false,
    type: OverlayType.VIDEO,
    content: videoSource.thumbnail?.url || '',
    src: videoSource.video.video.url,
    styles: {
      animation: {
        exit: 'fade',
      },
    },
  };
  return videoOverlay as ClipOverlay;
}
