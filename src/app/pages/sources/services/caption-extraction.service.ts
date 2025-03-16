import { Injectable } from '@angular/core';
import { openAiWhisperApiToCaptions } from '@remotion/openai-whisper';
import { Caption, createTikTokStyleCaptions } from '@remotion/captions';

import { IAgentSource } from '../models/sources.model';
import { SourceService } from '../sources.service';

@Injectable({
  providedIn: 'root',
})
export class CaptionExtractionService {
  constructor(private sourceService: SourceService) {}

  public async extractRemotionCaptions(source: IAgentSource): Promise<Caption[]> {
    console.log('Extracting remotion captions', source);
    const captions = openAiWhisperApiToCaptions({ transcription: source?.video?.transcription });
    console.log('Captions', captions);
    // Additional process becouse i don't like the precision of the timestamps
    captions.captions.forEach(caption => {
      caption.startMs = Math.round(caption.startMs);
      caption.endMs = Math.round(caption.endMs);
      caption.timestampMs = caption.timestampMs ? Math.round(caption.timestampMs) : null;
    });

    const update: any = { video: { captions: { remotion: captions.captions } } };
    console.log('Update', update);

    if (!source?.video?.captions) {
      update.video.captions = { remotion: captions.captions };
    } else {
      update.video.captions.remotion = captions.captions;
    }
    await this.sourceService.updateSource(source.id, update);

    return captions.captions;
  }

  public async extractTiktokStyleCaptions(source: IAgentSource) {
    console.log('Extracting tiktok style captions', source);
    const tiktokCaptions = createTikTokStyleCaptions({ captions: source?.video?.captions?.remotion!, combineTokensWithinMilliseconds: 2500 });
    // Starting to be very dangerus to save all properties.
    // Here i need to update instead of save and check if nested properties update only one work.
    const update: any = { video: { captions: { tiktokStyle: tiktokCaptions.pages } } };

    const response = await this.sourceService.updateSource(source.id, update);

    console.log('Tiktok style captions extracted', response);
    return response;
  }

  public async translateTiktokStylePaginatedCaptions(source: IAgentSource) {
    if (!source?.video?.captions?.tiktokStyle) {
      console.error('First extract tiktok style captions, cant proceed with translation');
      return;
    }

    console.log('Translating tiktok style paginated captions', source);
    // const tiktokCaptions = createTikTokStyleCaptions({ captions: source?.video?.captions?.remotion!, combineTokensWithinMilliseconds: 2500 });
    // console.log('Tiktok style captions', tiktokCaptions);

    // const update: any = { video: { captions: { tiktokStyleSpanish: tiktokCaptions.pages } } };
    // const response = await this.sourceService.updateSource(source.id, update);
    // console.log('Tiktok style captions translated', response);
    return {};
  }
}
