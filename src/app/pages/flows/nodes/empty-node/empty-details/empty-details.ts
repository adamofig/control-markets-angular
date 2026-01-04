import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-empty-details',
  templateUrl: './empty-details.html',
  styleUrls: ['./empty-details.css'],
  standalone: true,
  imports: [CommonModule, JsonPipe, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule],
})
export class EmptyDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  public form!: FormGroup;
  public node: any;

  ngOnInit() {
    this.node = this.config.data;
    this.initForm();
  }

  private initForm() {
    const nodeData = this.node?.data?.nodeData;
    this.form = this.fb.group({
      name: [nodeData?.name || '', [Validators.required]],
      description: [nodeData?.description || ''],
    });
  }

  public save() {
    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
  }

  public cancel() {
    this.ref.close();
  }
}
