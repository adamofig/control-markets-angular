import { Component, ChangeDetectionStrategy, signal, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ResizableSegmentComponent, ResizableSegment } from '../resizable-segment/resizable-segment.component';
import { IVideoProjectGenerator } from '../../video-generator/models/videoGenerators.model';

@Component({
  selector: 'app-resizable-segment-demo',
  templateUrl: './resizable-segment-demo.component.html',
  styleUrls: ['./resizable-segment-demo.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ResizableSegmentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableSegmentDemoComponent implements OnInit, AfterViewInit {
  @Input() videoProject: IVideoProjectGenerator | null = null;
  videoPercentage = 100;
  durationSeconds = 100; // seconds

  containerWidthPx = signal<number>(0);

  segment = signal<ResizableSegment>({ start: 20, end: 80, color: '#E5E5C7' });

  ngOnInit(): void {
    this.durationSeconds = Math.ceil(this.videoProject?.sources?.[0].reference?.video.transcription?.duration ?? 100);
    const start = this.videoProject?.compositionPlan?.overlays[0].fragment?.startSec;
    const end = this.videoProject?.compositionPlan?.overlays[0].fragment?.endSec;

    this.segment.set({ start: Number(start), end: Number(end), color: '#E5E5C7' });
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
}
