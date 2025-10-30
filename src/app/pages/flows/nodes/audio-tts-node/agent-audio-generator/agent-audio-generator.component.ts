import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-agent-audio-generator',
  imports: [CommonModule, TextareaModule, FormsModule, ButtonModule],
  templateUrl: './agent-audio-generator.component.html',
  styleUrls: ['./agent-audio-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AgentAudioGeneratorComponent {
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public message = '';

  generateAudio() {
    this.ref.close({ message: this.message });
  }

  cancel() {
    this.ref.close();
  }
}
