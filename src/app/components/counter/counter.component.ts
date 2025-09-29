import { Component, Input, OnChanges, OnDestroy, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusJob } from 'src/app/pages/flows/models/flows.model';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CounterComponent implements OnChanges, OnDestroy {
  @Input() status: StatusJob = StatusJob.DEFAULT;

  public elapsedSeconds = signal(0);
  public StatusJob = StatusJob;
  private timer: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      const newStatus = changes['status'].currentValue;
      if (newStatus === StatusJob.IN_PROGRESS) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.elapsedSeconds.set(0);
    this.timer = setInterval(() => {
      this.elapsedSeconds.update(s => s + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
