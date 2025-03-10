import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompositionProps, Overlay, OverlayType } from './rve.models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SegFramesCalcPipe } from './seg-frames-calc.pipe';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-rve',
  imports: [TagModule, ButtonModule, SegFramesCalcPipe, JsonPipe],
  templateUrl: './rve.html',
  styleUrl: './rve.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RVEComponent implements OnInit {
  OverlayType = OverlayType;
  constructor() {}

  public overlays: Overlay[] = [
    {
      left: 53,
      top: 68,
      width: 964,
      height: 1780,
      durationInFrames: 388,
      videoStartTime: 500,
      from: 0,
      id: 5,
      rotation: 0,
      row: 0,
      isDragging: false,
      type: OverlayType.VIDEO,
      content: 'https://images.pexels.com/videos/7660624/pexels-photo-7660624.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
      src: 'https://storage.googleapis.com/niche-market-dev.firebasestorage.app/youtube/eGLSPyGszjo.mp4',
      styles: {
        animation: {
          exit: 'fade',
        },
      },
    },
  ];

  ngOnInit(): void {}

  public downloadComposition() {
    const composition: CompositionProps = {
      overlays: this.overlays,
      durationInFrames: 88,
      width: 1920,
      height: 1080,
      fps: 30,
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
