import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SseTestService } from './sse-test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnDestroy {
  sseService = inject(SseTestService);

  emitTest() {
    this.sseService.emit('Hello from Angular! ' + new Date().toLocaleTimeString())
      .subscribe({
        next: (response) => console.log('Emit success:', response),
        error: (error) => console.error('Emit error:', error)
      });
  }

  ngOnDestroy() {
    this.sseService.disconnect();
  }
}


