import { IAgentSource } from '../../sources/models/sources.model';
import { ClipOverlay, FPS, OverlayType } from './composition-editor-adapter.models';

export function getVideoOverlay(videoSource: IAgentSource): ClipOverlay {
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
