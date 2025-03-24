import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dialogs',
  imports: [],
  template: `<p>dialogs works!</p>`,
  styleUrl: './dialogs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsComponent { }
