import { Pipe, PipeTransform } from '@angular/core';
import { Overlay, OverlayType, ClipOverlay } from './composition-editor-adapter.models';

@Pipe({
  name: 'segFramesCalc',
  standalone: true,
})
export class SegFramesCalcPipe implements PipeTransform {
  transform(overlay: Overlay, fps: number): { fromSeg: number; toSeg: number; totalSegs: number } {
    if (overlay.type === OverlayType.VIDEO) {
      let endFrame = (overlay as any).videoStartTime + (overlay as any).durationInFrames;
      let fromSeg = (overlay as any).videoStartTime / fps;
      fromSeg = Math.round(fromSeg * 100) / 100;
      console.log('fromSeg', overlay.videoStartTime, endFrame, fromSeg);

      let toSeg = endFrame / fps;
      toSeg = Math.round(toSeg * 100) / 100;

      return { fromSeg, toSeg, totalSegs: toSeg - fromSeg };
    } else {
      return {
        fromSeg: overlay.from / fps,
        toSeg: (overlay.from + overlay.durationInFrames) / fps,
        totalSegs: (overlay.from + overlay.durationInFrames) / fps - overlay.from / fps,
      };
    }
    // return { fromSeg: overlay.from / fps, toSeg: ((overlay as any).videoStartTime ?? 0 + (overlay as any).durationInFrames) / fps };
  }
}
