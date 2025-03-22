import { Component, ChangeDetectionStrategy, signal, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableSegmentComponent, ResizableSegment } from '../resizable-segment/resizable-segment.component';
import { IOverlayPlan, IVideoProjectGenerator } from '../../models/video-project.model';
import { VideoGeneratorService } from '../../services/video-project-gen.service';

@Component({
  selector: 'app-timeline-manager',
  templateUrl: './timeline-manager.html',
  styleUrls: ['./timeline-manager.scss'],
  standalone: true,
  imports: [CommonModule, ResizableSegmentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeLineManager implements OnInit, AfterViewInit {
  @Input() videoProject: IVideoProjectGenerator | null = null;
  durationSeconds = 0; // seconds

  containerWidthPx = signal<number>(0);

  segment = signal<ResizableSegment>({ startSec: 0, endSec: 100, color: '#E5E5C7' });

  constructor(private videoGeneratorService: VideoGeneratorService) {}

  ngOnInit(): void {
    this.durationSeconds = Math.ceil(this.videoProject?.sources?.[0].reference?.video.transcription?.duration ?? 100);
    const start = this.videoProject?.compositionPlan?.overlays[0].fragment?.startSec;
    const end = this.videoProject?.compositionPlan?.overlays[0].fragment?.endSec;
    this.segment.set({ startSec: Number(start), endSec: Number(end), color: '#E5E5C7' });
  }

  ngAfterViewInit(): void {
    // Initialize container width
    setTimeout(() => this.updateContainerWidth(), 0);
  }

  onResizeSegment(updatedSegment: ResizableSegment): void {
    this.segment.set(updatedSegment);
  }

  onWindowResize(): void {
    // Update container width when window is resized
    this.updateContainerWidth();
  }

  private updateContainerWidth(): void {
    const container = document.querySelector('.demo-container') as HTMLElement;
    if (container) {
      this.containerWidthPx.set(container.offsetWidth);
    }
  }

  /**
   * Calculates the time in seconds from a percentage value
   * @param percent - Percentage value (0-100)
   * @returns Time in seconds
   */
  calculateTimeFromPercent(percent: number): number {
    console.log('time percentage - percent', percent);
    return (percent / 100) * this.durationSeconds;
  }

  public saveComposition(): void {
    // TODO: for now overwrites everything, take care of this.
    const videoOverlay: IOverlayPlan = {
      type: 'video',
      sourceId: this.videoProject?.sources?.[0].id || '',
      timelineStartSec: this.segment()?.startSec,
      timelineEndSec: this.segment()?.endSec,
      fragment: {
        startSec: this.segment()?.startSec,
        endSec: this.segment()?.endSec,
      },
      fragments: [],
    };
    const overlay: IOverlayPlan[] = [videoOverlay];
    this.videoProject!.compositionPlan!.overlays = overlay;

    this.videoGeneratorService.saveVideoGenerator(this.videoProject!);
  }
}
