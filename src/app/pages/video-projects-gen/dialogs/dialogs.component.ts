import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ControlValueAccessor, FormBuilder, FormGroup, FormArray, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CloudStorageData } from '@dataclouder/ngx-cloud-storage';
import { IDialog, IVideoProjectGenerator } from '../models/video-project.model';

@Component({
  selector: 'app-dialogs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DialogsComponent),
      multi: true,
    },
  ],
})
export class DialogsComponent implements ControlValueAccessor, OnInit {
  @Input() dialogsForm: FormArray = this.fb.array([]);
  @Input() videoProject: IVideoProjectGenerator | null = null;

  // Default values for new dialogs
  private defaultDialog: Partial<IDialog> = {
    content: '',
    audio: {} as CloudStorageData,
    voice: 'default-voice',
    transcription: null,
    captions: null,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.videoProject?.dialogs) {
      this.videoProject.dialogs.forEach(dialog => this.addDialog());
    }

    this.dialogsForm.patchValue(this.videoProject?.dialogs || []);

    // Subscribe to form changes to propagate to parent
    this.dialogsForm.valueChanges.subscribe((value: IDialog[]) => {
      this.onChange(value);
    });
  }

  // Helper method to get typed controls for the template
  get dialogControls(): FormGroup[] {
    return this.dialogsForm.controls as FormGroup[];
  }

  // Add a new dialog to the form
  addDialog(): void {
    const dialogGroup = this.fb.group({
      content: [this.defaultDialog.content],
      audio: [this.defaultDialog.audio],
      voice: [this.defaultDialog.voice],
      transcription: [this.defaultDialog.transcription],
      captions: [this.defaultDialog.captions],
    });

    this.dialogsForm.push(dialogGroup);
  }

  // Remove a dialog at the specified index
  removeDialog(index: number): void {
    this.dialogsForm.removeAt(index);

    // Ensure there's always at least one dialog
    if (this.dialogsForm.length === 0) {
      this.addDialog();
    }

    this.onChange(this.dialogsForm.value);
  }

  // ControlValueAccessor implementation
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(dialogs: IDialog[]): void {
    if (dialogs && dialogs.length) {
      // Clear existing form array
      while (this.dialogsForm.length) {
        this.dialogsForm.removeAt(0);
      }

      // Add each dialog to form array
      dialogs.forEach(dialog => {
        this.dialogsForm.push(
          this.fb.group({
            content: [dialog.content || this.defaultDialog.content],
            audio: [dialog.audio || this.defaultDialog.audio],
            voice: [dialog.voice || this.defaultDialog.voice],
            transcription: [dialog.transcription || this.defaultDialog.transcription],
            captions: [dialog.captions || this.defaultDialog.captions],
          })
        );
      });
    } else {
      // If no dialogs provided, reset to a single empty dialog
      while (this.dialogsForm.length) {
        this.dialogsForm.removeAt(0);
      }
      this.addDialog();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.dialogsForm.disable();
    } else {
      this.dialogsForm.enable();
    }
  }

  playAudio(index: number): void {
    const dialog = this.dialogsForm.at(index);
    if (dialog && dialog.get('audio')?.value) {
      // Play audio here
    }
  }
}
