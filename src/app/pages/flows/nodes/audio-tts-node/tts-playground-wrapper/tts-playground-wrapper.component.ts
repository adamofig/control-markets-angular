import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TTSGenerated, TtsPlaygroundComponent, TTSPlaygroundSettings } from '@dataclouder/ngx-vertex';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tts-playground-wrapper',
  imports: [TtsPlaygroundComponent, CommonModule],
  templateUrl: './tts-playground-wrapper.component.html',
  styleUrls: ['./tts-playground-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TtsPlaygroundWrapperComponent {
  @Input() settings: TTSPlaygroundSettings = {
    storagePath: 'temporal',
  };

  public ttsSettings: TTSPlaygroundSettings | null = null;

  @Output() ttsGenerated = new EventEmitter<TTSGenerated>();
  @Output() formValues = new EventEmitter<Partial<TTSPlaygroundSettings>>();
  public config = inject(DynamicDialogConfig);

  onTtsGenerated(event: TTSGenerated) {
    if (this.config.data.onTtsGenerated) {
      this.config.data.onTtsGenerated(event);
    }
    this.ttsGenerated.emit(event);
  }

  onFormValues(event: Partial<TTSPlaygroundSettings>) {
    if (this.config.data.onFormValues) {
      this.config.data.onFormValues(event);
    }
    this.formValues.emit(event);
  }
}
