import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormArray, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { IDialog } from '../models/video-project.model';
import { VideoFormDefinitionService } from '../video-projects-form/video-project-form-definition.service';
import { DialogItemComponent } from './dialog-item/dialog-item.component';

@Component({
  selector: 'app-dialogs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogItemComponent],
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css'],
})
export class DialogsComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private formDefintions = inject(VideoFormDefinitionService);

  @Input() arrayForm: FormArray = this.fb.array([]);
  @Input() dialogs?: IDialog[];

  ngOnInit(): void {
    this.populateArray(this.dialogs || []);
  }

  public populateArray(array: IDialog[]): void {
    for (const dialog of array) {
      this.arrayForm.push(this.fb.group(dialog));
    }
  }

  removeDialog(index: number): void {
    this.arrayForm.removeAt(index);
  }

  playAudio(index: number): void {
    const dialog = this.arrayForm.at(index);
    if (dialog && dialog.get('audio')?.value) {
      // Play audio here
    }
  }

  pushDialogForm(): void {
    this.arrayForm.push(this.formDefintions.createDialogForm());
  }

  getFormGroup(index: number): FormGroup {
    return this.arrayForm.at(index) as FormGroup;
  }
}
