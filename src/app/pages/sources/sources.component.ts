import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SourceDetailComponent } from './source-detail/source-detail.component';
import { SourceFormComponent } from './source-form/source-form.component';
import { SourceListComponent } from './source-list/source-list.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sources',
  imports: [RouterModule],
  templateUrl: './sources.component.html',
  styleUrl: './sources.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesComponent {}
