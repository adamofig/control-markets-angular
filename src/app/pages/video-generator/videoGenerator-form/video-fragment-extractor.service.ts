import { Injectable } from '@angular/core';
import { VideoGeneratorService } from '../videoGenerators.service';
import { extractJsonFromString } from '@dataclouder/ngx-core';
import { BEST_FRAGMENT_DEFINITION, IFragmentExtraction, IVideoProjectGenerator } from '../models/videoGenerators.model';

@Injectable({
  providedIn: 'root',
})
export class VideoFragmentExtractorService {
  constructor(private videoGeneratorService: VideoGeneratorService) {}

  public async getBestFragments(videoProject: IVideoProjectGenerator, fragmentExtraction: { instructions: string; sourceId: string }): Promise<void> {
    try {
      // Validate source exists
      const source = this.validateAndGetSource(videoProject, fragmentExtraction.sourceId);
      if (!source) return;

      // Build instructions for AI
      const instructions = this.buildInstructions(videoProject, source, fragmentExtraction.instructions);

      // Get extraction result from AI
      const extractionResult = await this.getFragmentFromAI(instructions);
      if (!extractionResult) return;

      // Save the extraction result to the project
      await this.saveExtractionToProject(videoProject, fragmentExtraction.sourceId, extractionResult);
    } catch (error) {
      console.error('Error in getBestFragments:', error);
    }
  }

  /**
   * Validates the source ID and returns the corresponding source
   */
  private validateAndGetSource(videoProject: IVideoProjectGenerator, sourceId: string) {
    if (!sourceId) {
      console.error('No source has been selected');
      return null;
    }

    const source = videoProject?.sources?.find(source => source.id === sourceId);
    if (!source) {
      console.error('Selected source not found in project');
      return null;
    }

    return source;
  }

  /**
   * Builds the instruction prompt for the AI
   */
  private buildInstructions(videoProject: IVideoProjectGenerator, source: any, customInstructions: string): string {
    let instructions =
      'I have a transcription from an audio file. Please analyze the following segments and identify the most viral-worthy parts for a TikTok video:';

    // Extract transcription segments
    const transcriptionJson = this.extractTranscriptionJson(videoProject, source);

    instructions += `
${transcriptionJson}

Please tell me a range of video time that would make the most engaging TikTok content and explain why they would be effective. The ideal segments should:
1. Be catchy and memorable
2. The total time should be between 20-60 seconds in length combine adjacent segments to make a longer video
3. Contain complete thoughts or phrases
4. Have emotional impact or humor
5. Do not select just one segment, select at least 2 segments to make a longer video, remember minimum 20 seconds

For the selected segments or combination, please provide:
- The start time and end time and total time of the final video
- A reason Why it would be effective for TikTok
- Any suggestions for visual elements or effects to enhance the video in edition
    `;

    // Add custom instructions if provided
    if (customInstructions) {
      instructions += `\n\n**${customInstructions}**\n\n`;
    }

    // Add format instructions
    instructions += '\n\nIMPORTANT: You must return only the JSON in the next format: ';
    instructions += '\n```' + BEST_FRAGMENT_DEFINITION + '\n```';

    return instructions;
  }

  /**
   * Extracts transcription JSON from the source
   */
  private extractTranscriptionJson(videoProject: IVideoProjectGenerator, source: any): string {
    if (!videoProject?.sources?.length) {
      return '';
    }

    const transcription = source.reference?.video?.transcription;
    if (!transcription) {
      throw new Error('No transcription available for this source');
    }

    let segments = [];

    if (transcription.words) {
      segments = transcription.words.map((word: { start: number; end: number; word: string }) => {
        return { start: word.start.toFixed(1), end: word.end.toFixed(1), text: word.word };
      });
    } else if (transcription.segments) {
      segments = transcription.segments.map((segment: any) => {
        return { start: segment.start, end: segment.end, text: segment.text };
      });
    } else {
      throw new Error('Transcription format not supported');
    }

    return '```json\n' + JSON.stringify(segments, null, 2) + '\n```';
  }

  /**
   * Gets extraction result from AI service
   */
  private async getFragmentFromAI(instructions: string): Promise<IFragmentExtraction | null> {
    try {
      const result = await this.videoGeneratorService.getBestFragments(instructions);
      console.log('AI Response:', result.content);

      const extractionResult = extractJsonFromString(result.content) as IFragmentExtraction;
      if (!extractionResult) {
        console.error('Failed to parse AI response as JSON');
        return null;
      }

      extractionResult.instructions = instructions;
      return extractionResult;
    } catch (error) {
      console.error('Error getting best fragments from AI:', error);
      return null;
    }
  }

  /**
   * Saves the extraction result to the video project
   */
  private async saveExtractionToProject(videoProject: IVideoProjectGenerator, sourceId: string, extractionResult: IFragmentExtraction): Promise<void> {
    // Initialize overlay plan if it doesn't exist
    if (!videoProject.overlayPlan) {
      videoProject.overlayPlan = [];
    }

    // Add new overlay plan item
    videoProject.overlayPlan.push({
      type: 'video',
      sourceId: sourceId,
      timelineStart: null,
      timelineEnd: null,
      fragment: extractionResult,
    });

    // Save the updated project
    try {
      const response = await this.videoGeneratorService.saveVideoGenerator(videoProject);
      console.log('Project saved successfully:', response);
    } catch (error) {
      console.error('Error saving video project:', error);
    }
  }
}
