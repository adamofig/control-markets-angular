import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { HttpCoreService } from '@dataclouder/ngx-core';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { MultiObjectStorageService } from '@dataclouder/ngx-cloud-storage';

@Component({
  selector: 'app-agent-audio-generator',
  imports: [CommonModule, TextareaModule, FormsModule, ButtonModule, SliderModule],
  templateUrl: './agent-audio-generator.component.html',
  styleUrls: ['./agent-audio-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AgentAudioGeneratorComponent implements OnInit {
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public message = '';
  public temperature = 0.9;

  public isGenerating = signal<boolean>(false);

  private storageService = inject(MultiObjectStorageService);

  private httpCoreService = inject(HttpCoreService);

  @Input() fullAgentCard: IAgentCard = {} as IAgentCard;
  @Output() ttsGenerated = new EventEmitter<any>();

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit', this.fullAgentCard);
  }

  async generateAudio(temperature = this.temperature, seed = 42) {
    this.isGenerating.set(true);
    try {
      console.log('generateAudio', this.fullAgentCard);

      const voice = (this.fullAgentCard as any)['voiceCloning'];

      if (!voice) {
        console.log('voice', voice);
        alert('El agente no tiene una voz para clonar');
        return;
      }

      const testData = {
        audio_url: voice.sample.url,
        scene_description: 'A person is speaking in a calm and clear voice.',
        transcript: this.message || 'Escribe un mensaje primero sopenco!',
        temperature: temperature,
        seed: seed,
      };

      const response = await this.httpCoreService.postFileAndGetBlob('clone-voice-by-url', testData, 'http://192.168.2.2:8001');

      console.log('response', response.body);

      // this.fullAgentCard.voiceClon
      console.log('generateAudio', this.message);
      const audioData = {
        blob: response.body,
        blobUrl: window.URL.createObjectURL(response.body),
      };

      const id = new Date().toISOString();
      const storage = await this.storageService.uploadObject(audioData.blob, 'flow/audios/' + id);

      console.log('storage -> ', storage);

      const event = { text: this.message, storage: storage };
      if (this.config.data?.ttsGenerated) {
        this.config.data.ttsGenerated(event);
      }
      this.ttsGenerated.emit(event);
      // this.ref.close(event);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      this.isGenerating.set(false);
    }
  }

  async generateVariations() {
    this.isGenerating.set(true);
    const temperatures = [0.3, 0.5, 0.9];
    for (const temp of temperatures) {
      const seed = Math.floor(Math.random() * 10000) + 1;
      await this.generateAudio(temp, seed);
    }
    this.isGenerating.set(false);
  }

  cancel() {
    this.ref.close();
  }
}
