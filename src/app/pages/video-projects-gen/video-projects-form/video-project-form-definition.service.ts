import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class VideoFormDefinitionService {
  private fb = inject(FormBuilder);

  public createMainForm() {
    return this.fb.group({
      name: [''],
      description: [''],
      dialogs: this.fb.array([]),
    });
  }

  // Todavia no lo utilizo.
  createDialogForm() {
    return this.fb.group({
      content: [''],
      audio: [''],
      voice: [''],
      transcription: [''],
      captions: [''],
    });
  }
}
