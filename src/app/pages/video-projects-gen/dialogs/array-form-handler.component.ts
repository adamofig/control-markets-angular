import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-array-form-handler',
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputGroupModule, InputGroupAddonModule, DividerModule],
  standalone: true,
  styles: [``],
  template: `
    <p-divider align="left" type="solid">
      <b style="text-transform: capitalize;">{{ entity() }}</b>
    </p-divider>

    @for (item of arrayForm()?.controls; track item.value; let i = $index) {

    <div style="margin-top: 6px; width: 100%;">
      <p-inputgroup>
        <p-inputgroup-addon>
          <p-button icon="pi pi-align-justify" severity="secondary" [text]="true" />
        </p-inputgroup-addon>
        <input pInputText type="text" [formControl]="$any(arrayForm().controls[i])" placeholder="Escribe {{ entity() }}..." />
        <p-inputgroup-addon>
          <p-button (click)="deleteFormArrayByIndex(i)" icon="pi pi-times" severity="danger" [text]="true" />
        </p-inputgroup-addon>
      </p-inputgroup>
    </div>
    }

    <div style="margin-top: 10px">
      <p-button (click)="pushControlToFormArray()" label="Agregar {{ entity() }}" [raised]="true" severity="help" size="small"></p-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayFormHandlerComponent {
  readonly arrayForm = input.required<FormArray>();
  readonly entity = input.required<string>();

  deleteFormArrayByIndex(index: number): void {
    this.arrayForm().removeAt(index);
  }

  pushControlToFormArray(): void {
    this.arrayForm().push(new FormControl(''));
  }
}
