import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ClipOverlay, CompositionProps, Overlay, OverlayType, CaptionOverlay, FPS } from './composition-editor-adapter.models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SegFramesCalcPipe } from './seg-frames-calc.pipe';
import { JsonPipe } from '@angular/common';
import { IOverlayPlan, IVideoProjectGenerator } from '../models/video-project.model';
import { MarkdownModule } from 'ngx-markdown';
import { createGanttChart } from './gantt-diagram.util';
import { downloadComposition, getCaptionsOverlay, getVideoOverlay } from './overlay-download.util';

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
    downloadComposition(this.videoProject!);
  }

  public buildOverlays(compositionPlan: IOverlayPlan[]) {
    const youtubeSource = this.videoProject?.sources?.find(source => source.reference?.type === 'youtube');
    if (!youtubeSource) throw new Error('No youtube source found');

    const overlays: Overlay[] = [];
    for (const overlay of compositionPlan) {
      const videoOverlay: Overlay = getVideoOverlay(youtubeSource.reference!, overlay);
      overlays.push(videoOverlay);

      if (youtubeSource.reference?.video?.captions) {
        // IMPROVE:  this assume ill want all time captions, if they are i added, but probably i should add in composition plan
        const captionsOverlay: Overlay = getCaptionsOverlay(youtubeSource.reference!, videoOverlay._overlayStartSec || 0);
        overlays.push(captionsOverlay);
      }
    }

    // think, how do i know the total duration of my video.
    const FIX_THIS_TIME = 20;

    const composition: CompositionProps = {
      overlays: [...overlays],
      durationInFrames: FIX_THIS_TIME * FPS,
      width: 1920,
      height: 1080,
      fps: FPS,
    };
  }

  // this should be in core
}
function downloadJson(composition: CompositionProps, arg1: string) {
  throw new Error('Function not implemented.');
}
