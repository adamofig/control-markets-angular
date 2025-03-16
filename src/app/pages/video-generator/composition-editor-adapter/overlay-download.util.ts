import { IAgentSource } from '../../sources/models/sources.model';
import { IOverlayPlan } from '../models/videoGenerators.model';
import { ClipOverlay, FPS, OverlayType } from './composition-editor-adapter.models';

export function getVideoOverlay(videoSource: IAgentSource, overlay: IOverlayPlan): ClipOverlay {
  const _timelineStartSec = overlay.timelineStartSec || 0;
  const _timelineEndSec = overlay.timelineEndSec || 0;
  const _durationInSeconds = overlay.fragment.durationSec;
  const _overlayStartSec = overlay.fragment.startSec || 0;
  const _overlayEndSec = overlay.fragment.endSec || 0;

  const videoOverlay = {
    id: 1,
    left: 53,
    top: 68,
    width: 964,
    height: 1780,
    // TIME IN FRAMES, i think this 3 allows calculate the time in frames of the overlay.
    from: _timelineStartSec * FPS,
    durationInFrames: _durationInSeconds * FPS,
    videoStartTime: _overlayStartSec * FPS,
    // TIME IN SECONDS METADATA.
    _timelineStartSec,
    _timelineEndSec,
    _durationInSeconds,
    _overlayStartSec,
    _overlayEndSec,

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
