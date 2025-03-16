import { Injectable } from '@angular/core';
import { openAiWhisperApiToCaptions } from '@remotion/openai-whisper';
import { createTikTokStyleCaptions } from '@remotion/captions';

import { IAgentSource } from '../models/sources.model';
import { SourceService } from '../sources.service';

@Injectable({
  providedIn: 'root',
})
export class CaptionExtractionService {
  constructor(private sourceService: SourceService) {}

  public async extractRemotionCaptions(source: IAgentSource) {
    console.log('Extracting remotion captions', source);
    const captions = openAiWhisperApiToCaptions({ transcription: source?.video?.transcription });
    // Additional process becouse i don't like the precision of the timestamps
    captions.captions.forEach(caption => {
      caption.startMs = Math.round(caption.startMs);
      caption.endMs = Math.round(caption.endMs);
      caption.timestampMs = caption.timestampMs ? Math.round(caption.timestampMs) : null;
    });

    if (source?.video) {
      source.video.captions!.remotion = captions.captions;
      this.sourceService.saveSource(source);
    }
  }

  public async extractTiktokStyleCaptions(source: IAgentSource) {
    console.log('Extracting tiktok style captions', source);
    const tiktokCaptions = createTikTokStyleCaptions({ captions: source?.video?.captions?.remotion!, combineTokensWithinMilliseconds: 2500 });
    // Starting to be very dangerus to save all properties.
    const response = await this.sourceService.saveSource({
      ...source,
      video: { ...source.video, captions: { ...source.video.captions, tiktokStyle: tiktokCaptions.pages } },
    });
    console.log('Tiktok style captions extracted', response);
    return response;
  }
}
