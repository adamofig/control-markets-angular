import { createTikTokStyleCaptions, TikTokPage } from '@remotion/captions';
import { IAgentSource } from '../../sources/models/sources.model';
import { ICompositionPlan, IOverlayPlan, IVideoProjectGenerator } from '../models/video-project.model';
import { CaptionOverlay, ClipOverlay, CompositionProps, FPS, OverlayType } from './composition-editor-adapter.models';
import { Caption as CaptionRVE } from './composition-editor-adapter.models';

export function getVideoOverlay(videoSource: IAgentSource, overlay: IOverlayPlan): ClipOverlay {
  const _timelineStartSec = overlay.timelineStartSec ? parseFloat(overlay.timelineStartSec.toFixed(2)) : 0;
  const _timelineEndSec = overlay.timelineEndSec ? parseFloat(overlay.timelineEndSec.toFixed(2)) : 0;
  const _overlayStartSec = overlay.fragment.startSec ? parseFloat(overlay.fragment.startSec.toFixed(2)) : 0;
  const _overlayEndSec = overlay.fragment.endSec ? parseFloat(overlay.fragment.endSec.toFixed(2)) : 0;
  let _durationInSeconds = overlay.fragment.durationSec ? parseFloat(overlay.fragment.durationSec.toFixed(2)) : 0;
  if (!_durationInSeconds && _overlayEndSec > 0) {
    _durationInSeconds = _overlayEndSec - _overlayStartSec;
  }

  const videoOverlay: ClipOverlay = {
    row: 0, // temporal
    id: 1, // temporal
    left: 53,
    top: 68,
    width: 964,
    height: 1780,
    // TIME IN FRAMES, i think this 3 allows calculate the time in frames of the overlay.
    from: Math.floor(_timelineStartSec * FPS),
    durationInFrames: _durationInSeconds ? Math.floor(_durationInSeconds * FPS) : 0,
    videoStartTime: Math.floor(_overlayStartSec * FPS),
    // TIME IN SECONDS METADATA.
    _timelineStartSec,
    _timelineEndSec,
    _durationInSeconds,
    _overlayStartSec,
    _overlayEndSec,

    rotation: 0,
    isDragging: false,
    type: OverlayType.VIDEO,
    content: videoSource.thumbnail?.url || '',
    src: videoSource.video.video.url || '',
    styles: {
      animation: {
        exit: 'fade',
      },
    },
  };
  return videoOverlay as ClipOverlay;
}

export function getCaptionsOverlay(videoSource: IAgentSource, offsetSeconds: number): CaptionOverlay {
  const durationFrames = (videoSource.video.transcription?.duration || 20) * FPS; // for now im getting from transcription check how to dinamically get it adjust
  const captions = videoSource.video.captions?.remotion || [];

  const tikTokCaptions = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 2000 });

  // downloadJson(tikTokCaptions, 'tiktok-captions');
  const captionsRVE = tikTokCaptions.pages.map(remotionTiktokPageToCaptionRVE);
  console.log('Result of transform captionsRVE', captionsRVE);
  // adjust millseconds to video start time
  captionsRVE.forEach((caption: any) => {
    caption.startMs = caption.startMs - offsetSeconds * 1000;
    caption.endMs = caption.endMs - offsetSeconds * 1000;
    caption.words.forEach((word: any) => {
      word.startMs = word.startMs - offsetSeconds * 1000;
      word.endMs = word.endMs - offsetSeconds * 1000;
    });
  });

  if (!captions.length) throw new Error('No captions source found');
  console.log('captions', captions);
  const captionsOverlay: CaptionOverlay = {
    id: 2,
    row: 0,
    left: 53,
    top: 68,
    width: 964,
    height: 1780,
    durationInFrames: durationFrames,
    from: 0,
    captions: captionsRVE,
    type: OverlayType.CAPTION,
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
    words: page.tokens.map((token: any) => ({
      word: token.text,
      startMs: token.fromMs,
      endMs: token.toMs,
      confidence: 1, // Default confidence since TikTokPage tokens don't have confidence
    })),
  };
}

export function downloadJson(jsonObject: Record<string, any>, fileName: string) {
  const jsonData = JSON.stringify(jsonObject, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function downloadComposition(videoProject: IVideoProjectGenerator) {
  const HardCodeTotalDurationInFrames = 900;
  const composition: CompositionProps = {
    overlays: [],
    durationInFrames: HardCodeTotalDurationInFrames,
    width: 1920,
    height: 1080,
    fps: 30,
  };

  let row = 0;
  for (const overlay of videoProject.compositionPlan?.overlays || []) {
    const source = videoProject.sources?.find(source => {
      const id = source.reference?.id || source.reference?._id;
      return id === overlay.sourceId;
    });
    if (!source) throw new Error('No source found');
    console.log('source', source);

    if (source.reference?.type === 'youtube') {
      const videoOverlay: ClipOverlay = getVideoOverlay(source.reference, overlay);
      composition.overlays.push(videoOverlay);

      if (source.reference?.video?.captions) {
        const captionsOverlay: CaptionOverlay = getCaptionsOverlay(source.reference, videoOverlay._overlayStartSec || 0);
        captionsOverlay.row = row;
        videoOverlay.row = row + 1;
        row = row + 2;
        composition.overlays.push(captionsOverlay);
      } else {
        // Caption should have lower row number to be above video overlay
        videoOverlay.row = row;
        row++;
      }
    }
  }

  downloadJson(composition, 'composition');
}

export function downloadVideoSourceAsComposition(source: IAgentSource, compositionPlan: ICompositionPlan) {
  const durationFrames = (source.video.transcription?.duration || 30) * FPS; // for now im getting from transcription

  const composition: CompositionProps = {
    overlays: [],
    durationInFrames: durationFrames,
    width: 1920,
    height: 1080,
    fps: 30,
  };

  for (const overlay of compositionPlan.overlays || []) {
    if (source.type === 'youtube') {
      const videoOverlay: ClipOverlay = getVideoOverlay(source, overlay);
      composition.overlays.push(videoOverlay);

      if (source.video?.captions) {
        const captionsOverlay: CaptionOverlay = getCaptionsOverlay(source, videoOverlay._overlayStartSec || 0);
        composition.overlays.push(captionsOverlay);
      }
    }
  }

  downloadJson(composition, 'composition');
}
