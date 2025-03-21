import { createTikTokStyleCaptions, TikTokPage } from '@remotion/captions';
import { IAgentSource } from '../../sources/models/sources.model';
import { ICompositionPlan, IOverlayPlan, IVideoProjectGenerator, SourceWithReference } from '../models/videoGenerators.model';
import { CaptionOverlay, ClipOverlay, CompositionProps, FPS, OverlayType } from './composition-editor-adapter.models';
import { Caption as CaptionRVE } from './composition-editor-adapter.models';

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
    durationInFrames: _durationInSeconds ? _durationInSeconds * FPS : 0,
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

export function getCaptionsOverlay(videoSource: IAgentSource, offsetSeconds: number): CaptionOverlay {
  const captions = videoSource.video.captions?.remotion || [];

  const tikTokCaptions = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 2000 });

  // downloadJson(tikTokCaptions, 'tiktok-captions');
  const captionsRVE = tikTokCaptions.pages.map(remotionTiktokPageToCaptionRVE);
  console.log('Result of transform captionsRVE', captionsRVE);
  // adjust millseconds to video start time
  captionsRVE.forEach(caption => {
    caption.startMs = caption.startMs - offsetSeconds * 1000;
    caption.endMs = caption.endMs - offsetSeconds * 1000;
    caption.words.forEach(word => {
      word.startMs = word.startMs - offsetSeconds * 1000;
      word.endMs = word.endMs - offsetSeconds * 1000;
    });
  });

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

  for (const overlay of videoProject.compositionPlan?.overlays || []) {
    const source = videoProject.sources?.find(source => source.reference?.id === overlay.sourceId);
    if (!source) throw new Error('No source found');
    console.log('source', source);

    if (source.reference?.type === 'youtube') {
      const videoOverlay: ClipOverlay = getVideoOverlay(source.reference, overlay);
      composition.overlays.push(videoOverlay);

      if (source.reference?.video?.captions) {
        const captionsOverlay: CaptionOverlay = getCaptionsOverlay(source.reference, videoOverlay._overlayStartSec || 0);
        composition.overlays.push(captionsOverlay);
      }
    }
  }

  downloadJson(composition, 'composition');
}

export function downloadCompositionV2(sources: SourceWithReference[], compositionPlan: ICompositionPlan) {
  const HardCodeTotalDurationInFrames = 900;
  const composition: CompositionProps = {
    overlays: [],
    durationInFrames: HardCodeTotalDurationInFrames,
    width: 1920,
    height: 1080,
    fps: 30,
  };

  for (const overlay of compositionPlan.overlays || []) {
    const source = sources.find(source => source.reference?.id === overlay.sourceId);
    if (!source) throw new Error('No source found');
    console.log('source', source);

    if (source.reference?.type === 'youtube') {
      const videoOverlay: ClipOverlay = getVideoOverlay(source.reference, overlay);
      composition.overlays.push(videoOverlay);

      if (source.reference?.video?.captions) {
        const captionsOverlay: CaptionOverlay = getCaptionsOverlay(source.reference, videoOverlay._overlayStartSec || 0);
        composition.overlays.push(captionsOverlay);
      }
    }
  }

  downloadJson(composition, 'composition');
}
