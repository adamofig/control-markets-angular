import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ClipOverlay, CompositionProps, Overlay, OverlayType } from './rve.models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SegFramesCalcPipe } from './seg-frames-calc.pipe';
import { JsonPipe } from '@angular/common';
import { IPlan, IVideoGenerator } from '../models/videoGenerators.model';
import { MarkdownModule } from 'ngx-markdown';
import { IAgentSource, IVideoSource } from '../../sources/models/sources.model';
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
  @Input() videoProject: IVideoGenerator | undefined = undefined;
  OverlayType = OverlayType;
  public ganttChart: string = '';
  constructor(private cdr: ChangeDetectorRef) {}

  public overlays: Overlay[] = [];

  ngOnInit(): void {
    const videoOverlay: Overlay = getVideoOverlay(this.videoProject as IVideoGenerator);

    this.overlays.push(videoOverlay);
    console.log('videoOverlay', videoOverlay);

    this.ganttChart = createGanttChart(this.videoProject?.plan);
    console.log('ganttChart', this.ganttChart);

    this.cdr.detectChanges();
  }

  public downloadComposition() {
    // Get the video overlays

    const videoOverlay: Overlay = getVideoOverlay(this.videoProject as IVideoGenerator);

    const durationInSeconds = 20;
    const durationInFrames = durationInSeconds * FPS;

    const composition: CompositionProps = {
      overlays: [videoOverlay],
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

    section Images
    Sticker 1     :s1, ${start}, ${end}s

    section Audio
    Song    :a1, ${start}, ${end}s
\`\`\``;

  console.log(ganttChart);

  return ganttChart;
}

function getVideoOverlay(videoProject: IVideoGenerator): ClipOverlay {
  const youtubeSource = videoProject.sources?.find(source => source.reference.type === 'youtube');
  if (!youtubeSource) throw new Error('No youtube source found');

  const durationInSeconds = 20;
  const offsetInSeconds = 5;
  const startSecond = 0;

  const source: IAgentSource = youtubeSource.reference;

  const videoOverlay = {
    id: 1,
    left: 53,
    top: 68,
    width: 964,
    height: 1780,
    durationInFrames: durationInSeconds * FPS,
    videoStartTime: offsetInSeconds * FPS,
    from: startSecond * FPS,
    rotation: 0,
    row: 0,
    isDragging: false,
    type: OverlayType.VIDEO,
    content: source.thumbnail?.url || '',
    src: source.video.video.url,
    styles: {
      animation: {
        exit: 'fade',
      },
    },
  };
  return videoOverlay as ClipOverlay;
}
