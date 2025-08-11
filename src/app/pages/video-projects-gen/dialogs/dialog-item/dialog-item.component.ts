import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IDialog } from '../../models/video-project.model';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { inject } from '@angular/core';
import { VertexAudioService } from '@dataclouder/ngx-vertex';

@Component({
  selector: 'app-dialog-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule, ButtonModule, InputTextModule, TooltipModule],
  templateUrl: './dialog-item.component.html',
  styleUrls: ['./dialog-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogItemComponent {
  private vertexAudioService = inject(VertexAudioService);
  @Input() formGroup!: FormGroup;
  @Input() index!: number;
  @Input() dialog?: IDialog;
  @Input() isLast!: boolean;

  @Output() remove = new EventEmitter<number>();
  @Output() playAudio = new EventEmitter<number>();

  onRemove(): void {
    this.remove.emit(this.index);
  }

  onPlayAudio(): void {
    this.playAudio.emit(this.index);
  }

  onAddAudio(): void {
    // const audioFile = this.vertexAudioService.generateAudio({
    //   text: this.formGroup.get('content')?.value,
    //   voiceName: 'es-ES-Standard-A',
    //   languageCode: 'es-ES',
    // });
    // LLamar al servicio de generar audio
    // Guardar el audio en el formGroup
    // Guardar el form
    // this.addAudio.emit(this.index);
  }
}
