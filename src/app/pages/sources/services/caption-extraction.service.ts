import { Inject, Injectable } from '@angular/core';
import { openAiWhisperApiToCaptions } from '@remotion/openai-whisper';
import { Caption, createTikTokStyleCaptions } from '@remotion/captions';

import { IAgentSource } from '../models/sources.model';
import { SourceService } from '../sources.service';
import { AgentCardService } from 'src/app/services/agent-cards.service';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
// import { DCProgressToastComponent } from '@dataclouder/ngx-core';
import { chunk } from 'lodash';

// import { extractJsonFromString } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class CaptionExtractionService {
  constructor(
    private sourceService: SourceService,
    private agentCardService: AgentCardService,
    @Inject(TOAST_ALERTS_TOKEN) private toastAlerts: ToastAlertsAbstractService
  ) {}

  public async extractRemotionCaptions(source: IAgentSource): Promise<Caption[]> {
    console.log('Extracting remotion captions', source);
    const captions = openAiWhisperApiToCaptions({ transcription: source?.video?.transcription! });
    console.log('Captions', captions);
    // Additional process becouse i don't like the precision of the timestamps
    captions.captions.forEach((caption: Caption) => {
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
    // Bueno este es mi primer intento, funciona peor no al 100%
    if (!source?.video?.captions?.tiktokStyle) {
      console.error('First extract tiktok style captions, cant proceed with translation');
      return;
    }
    const paginatedCaptions = source?.video?.captions?.tiktokStyle;

    const chunkedCaptions = chunk(paginatedCaptions, 15);

    const translatedPages: any[] = [];

    for (const [index, chuck] of chunkedCaptions.entries()) {
      this.toastAlerts.info({ title: 'Translating tiktok style paginated captions', subtitle: `Translating chunk ${index + 1} of ${chunkedCaptions.length}` });
      const prompt = getPromptTranslatePaginatedCaptions(JSON.stringify(chuck));
      console.log('Prompt', prompt);

      const response = await this.agentCardService.callInstruction(prompt);
      console.log('Response', response);
      const translationChuck = extractJsonFromString(response.content);
      console.log('Translated pages', translationChuck);
      if (Array.isArray(translationChuck)) {
        translatedPages.push(...translationChuck);
      } else {
        // translatedPages.push(translationChuck);
      }
    }

    console.log('Translated pages', translatedPages);
    const update: any = { video: { captions: { tiktokStyleSpanish: translatedPages } } };
    await this.sourceService.updateSource(source.id, update);

    return {};
  }
}

function extractPagesText(paginatedCaptions: any) {
  return paginatedCaptions.map((page: any) => ({ text: page.text }));
}

export function extractJsonFromString(content: string): any {
  console.log(content);
  try {
    // First try to parse the entire string as JSON
    return JSON.parse(content);
  } catch {
    try {
      // If that fails, try to find the first valid JSON object or array in the string
      const matches = content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/g);
      if (!matches) return null;

      // Try each matched potential JSON string until we find a valid one
      for (const match of matches) {
        try {
          return JSON.parse(match);
        } catch {
          continue;
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
}

function getPromptTranslatePaginatedCaptions(jsonCaptions: string) {
  // This prompt is to translate pages, that contains tokens, but have some issues with large sentences.
  return `
Translate the English subtitles to Spanish
Create a new JSON structure that preserves the timing information
Map the Spanish translation to the original timing structure as accurately as possible
This is for a song bilingual subtitles. Note that due to the nature of the translation, Spanish and English have different word orders and lengths, so we need a careful approach to maintain synchronization with the audios. Let me create a Spanish translation with aligned timing. 
may be is not possible to adapt 100% accuarate but try your best to preserve the meaning while adapting to Spanish grammar and structure.
Use semantic alignment approach, try to adapt the words and sentences to their English counterparts based on meaning, rather than a strict word-by-word translation.
keep the exact timing information from the English subtitles. 
\`\`\`json
${jsonCaptions}
\`\`\`
return only the same JSON structure but in spanish, nothing else.
`;
}

function getPromptTranslatePageText(pageText: string) {
  // This prompt only translate the text, not the timing information.

  return `
Translate the English subtitles to Spanish using the following guidelines:

1. Create a new JSON structure that preserves the original format exactly
2. Map the Spanish translation to match the timing of the original structure as precisely as possible
3. Since this is for bilingual song subtitles, maintain synchronization with the audio by:
   - Preserving the meaning while adapting to Spanish grammar and structure
   - Using a semantic alignment approach rather than word-by-word translation
   - Matching phrase lengths where possible to maintain timing
4. When exact timing matches aren't possible, prioritize:
   - Natural-sounding Spanish expressions
   - Maintaining the emotional tone and style of the lyrics
   - Keeping key words at similar positions when they align with musical emphasis

This is the text to translate:

\`\`\`json
${pageText}
\`\`\`

return only the same JSON structure but in spanish, nothing else.
`;
}
