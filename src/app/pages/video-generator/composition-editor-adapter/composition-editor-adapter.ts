import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ClipOverlay, CompositionProps, Overlay, OverlayType, CaptionOverlay, FPS } from './composition-editor-adapter.models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SegFramesCalcPipe } from './seg-frames-calc.pipe';
import { JsonPipe } from '@angular/common';
import { IOverlayPlan, IVideoProjectGenerator } from '../models/videoGenerators.model';
import { MarkdownModule } from 'ngx-markdown';
import { IAgentSource } from '../../sources/models/sources.model';
import { createTikTokStyleCaptions, TikTokPage } from '@remotion/captions';
import { Caption as CaptionRVE } from './composition-editor-adapter.models';
import { createGanttChart } from './gantt-diagram.util';
import { getVideoOverlay } from './overlay-download.util';

@Component({
  selector: 'app-rve',
  imports: [TagModule, ButtonModule, SegFramesCalcPipe, JsonPipe, MarkdownModule],
  templateUrl: './composition-editor-adapter.html',
  styleUrl: './composition-editor-adapter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CompositionEditorComponent implements OnInit {
  @Input() videoProject: IVideoProjectGenerator | undefined | null = null;

  public OverlayType = OverlayType;
  public ganttChart: string = '';
  constructor(private cdr: ChangeDetectorRef) {}

  public overlays: Overlay[] = [];

  ngOnInit(): void {
    this.ganttChart = createGanttChart(this.videoProject?.compositionPlan?.overlays);
    this.cdr.detectChanges();
  }

  public downloadComposition() {
    for (const overlay of this.videoProject?.compositionPlan?.overlays || []) {
      overlay.sourceId;
      const source = this.videoProject?.sources?.find(source => source.reference._id === overlay.sourceId);
      if (!source) throw new Error('No source found');
      console.log('source', source);

      if (source.reference.type === 'youtube') {
        const videoOverlay: Overlay = getVideoOverlay(source.reference);
        this.overlays.push(videoOverlay);
      }
    }

    // this.downloadJson(composition, 'composition');
  }

  public buildOverlays(compositionPlan: IOverlayPlan[]) {
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
  }

  // this should be in core
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
