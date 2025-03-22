import { Component, Input, Output, EventEmitter, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DragDropModule, CdkDragMove, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';

export interface ResizableSegment {
  start: number;
  end: number;
  color?: string;
}

@Component({
  selector: 'app-resizable-segment',
  templateUrl: './resizable-segment.component.html',
  styleUrls: ['./resizable-segment.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableSegmentComponent implements OnInit, OnDestroy {
  @ViewChild('segmentContainer') segmentContainer!: ElementRef;

  @Input({ required: true }) segment: ResizableSegment = { start: 0, end: 100 };
  @Input() totalDurationSec = 100; // Duration in seconds
  @Input() containerWidthPx = 0; // Width in pixels
  @Input() color = '#F4D35E'; // Default color

  @Output() segmentChange = new EventEmitter<ResizableSegment>();

  // State signals
  isDragging = signal<boolean>(false);
  resizeMode = signal<'none' | 'start' | 'end'>('none');
  currentStart = signal<number>(0);
  currentEnd = signal<number>(0);

  // Computed values for template binding
  leftPositionPercent = computed(() => this.getPositionPercent(this.currentStart()));
  widthPercent = computed(() => this.getWidthPercent(this.currentStart(), this.currentEnd()));

  // CSS class states
  segmentClasses = computed(() => ({
    'is-resizing': this.resizeMode() !== 'none',
    'resize-start': this.resizeMode() === 'start',
    'resize-end': this.resizeMode() === 'end',
    'is-dragging': this.isDragging() && this.resizeMode() === 'none',
  }));

  // Internal state
  private handleDragStartX = 0;
  private initialSegmentStart = 0;
  private initialSegmentEnd = 0;
  private lastDeltaX = 0;
  private touchIdentifier = -1;

  ngOnInit() {
    // Initialize with segment values
    this.currentStart.set(this.segment.start);
    this.currentEnd.set(this.segment.end);
  }

  ngOnDestroy() {
    // Clean up event listeners if component is destroyed while resizing
    this.cleanupResizeListeners();
  }

  // Convert time position to percentage for CSS positioning
  getPositionPercent(time: number): number {
    return (time / this.totalDurationSec) * 100;
  }

  getWidthPercent(start: number, end: number): number {
    return ((end - start) / this.totalDurationSec) * 100;
  }

  // Handle segment body interactions
  onSegmentMouseDown(event: MouseEvent): void {
    // Only process if clicking on the segment itself (not on handles)
    if (!(event.target as HTMLElement).classList.contains('handle')) {
      // The cdkDrag will handle the actual dragging, ensure resize mode is off
      this.resizeMode.set('none');
    }
  }

  // Handle drag operations
  onDragStarted(event: CdkDragStart): void {
    this.isDragging.set(true);
    this.initialSegmentStart = this.segment.start;
    this.initialSegmentEnd = this.segment.end;
  }

  onDragMoved(event: CdkDragMove): void {
    if (!this.isDragging()) return;

    // Calculate the drag distance in time units
    const pixelToTimeRatio = this.totalDurationSec / this.containerWidthPx;
    const dragDistanceInTime = event.distance.x * pixelToTimeRatio;

    // Create new segment with updated position
    const segmentDuration = this.segment.end - this.segment.start;
    let newStart = Math.max(0, this.initialSegmentStart + dragDistanceInTime);

    // Ensure segment doesn't go beyond timeline
    if (newStart + segmentDuration > this.totalDurationSec) {
      newStart = this.totalDurationSec - segmentDuration;
    }

    // Update current values for visual feedback
    this.currentStart.set(newStart);
    this.currentEnd.set(newStart + segmentDuration);

    const updatedSegment: ResizableSegment = {
      ...this.segment,
      start: newStart,
      end: newStart + segmentDuration,
    };

    this.segmentChange.emit(updatedSegment);
  }

  onDragEnded(event: CdkDragEnd): void {
    this.isDragging.set(false);

    // Reset the segment element position in the DOM since we're controlling positioning with our own logic
    if (event.source.element.nativeElement) {
      event.source.reset();
    }
  }

  // Handle resize operations
  onResizeHandleMouseDown(event: MouseEvent, handleType: 'start' | 'end'): void {
    event.stopPropagation();
    event.preventDefault();

    this.resizeMode.set(handleType);
    this.handleDragStartX = event.clientX;
    this.lastDeltaX = 0;

    this.initialSegmentStart = this.segment.start;
    this.initialSegmentEnd = this.segment.end;

    // Add temporary event listeners for resize operation
    document.addEventListener('mousemove', this.handleResizeMove);
    document.addEventListener('mouseup', this.handleResizeEnd);

    // Add a class to the body to indicate resizing (for cursor styling)
    document.body.classList.add('resizing-segment');
  }

  // Touch event handling for resize
  onResizeHandleTouchStart(event: TouchEvent, handleType: 'start' | 'end'): void {
    event.stopPropagation();
    event.preventDefault();

    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.touchIdentifier = touch.identifier;
      this.resizeMode.set(handleType);
      this.handleDragStartX = touch.clientX;
      this.lastDeltaX = 0;

      this.initialSegmentStart = this.segment.start;
      this.initialSegmentEnd = this.segment.end;

      // Add temporary event listeners for resize operation
      document.addEventListener('touchmove', this.handleResizeTouchMove, { passive: false });
      document.addEventListener('touchend', this.handleResizeTouchEnd);
      document.addEventListener('touchcancel', this.handleResizeTouchEnd);

      // Add a class to the body to indicate resizing (for cursor styling)
      document.body.classList.add('resizing-segment');
    }
  }

  private handleResizeMove = (event: MouseEvent) => {
    if (this.resizeMode() === 'none') return;

    // Calculate the current delta from the initial position
    const currentDeltaX = event.clientX - this.handleDragStartX;

    // Instead of using the initial position as reference, use the current incremental movement
    const incrementalDeltaX = currentDeltaX - this.lastDeltaX;
    this.lastDeltaX = currentDeltaX;

    const pixelToTimeRatio = this.totalDurationSec / this.containerWidthPx;
    const incrementalTimeDelta = incrementalDeltaX * pixelToTimeRatio;

    // Minimum segment duration in seconds
    const minSegmentDuration = 2;

    if (this.resizeMode() === 'start') {
      // Resizing from the start (left handle)
      const newStart = Math.max(0, Math.min(this.currentEnd() - minSegmentDuration, this.currentStart() + incrementalTimeDelta));

      // Update visual state (real-time CSS updates)
      this.currentStart.set(newStart);

      // Emit the updated segment
      const updatedSegment = {
        ...this.segment,
        start: newStart,
      };
      this.segmentChange.emit(updatedSegment);
    } else {
      // Resizing from the end (right handle)
      const newEnd = Math.min(this.totalDurationSec, Math.max(this.currentStart() + minSegmentDuration, this.currentEnd() + incrementalTimeDelta));

      // Update visual state (real-time CSS updates)
      this.currentEnd.set(newEnd);

      // Emit the updated segment
      const updatedSegment = {
        ...this.segment,
        end: newEnd,
      };
      this.segmentChange.emit(updatedSegment);
    }
  };

  private handleResizeTouchMove = (event: TouchEvent) => {
    if (this.resizeMode() === 'none') return;

    // Prevent scrolling while resizing
    event.preventDefault();

    // Find the touch that matches our identifier
    const touchList = Array.from(event.touches);
    const touch = touchList.find(t => t.identifier === this.touchIdentifier);

    if (!touch) return;

    // Calculate the current delta from the initial position
    const currentDeltaX = touch.clientX - this.handleDragStartX;

    // Use incremental movement
    const incrementalDeltaX = currentDeltaX - this.lastDeltaX;
    this.lastDeltaX = currentDeltaX;

    const pixelToTimeRatio = this.totalDurationSec / this.containerWidthPx;
    const incrementalTimeDelta = incrementalDeltaX * pixelToTimeRatio;

    // Minimum segment duration
    const minSegmentDuration = 5;

    if (this.resizeMode() === 'start') {
      // Resizing from the start (left handle)
      const newStart = Math.max(0, Math.min(this.currentEnd() - minSegmentDuration, this.currentStart() + incrementalTimeDelta));
      this.currentStart.set(newStart);

      const updatedSegment = {
        ...this.segment,
        start: newStart,
      };
      this.segmentChange.emit(updatedSegment);
    } else {
      // Resizing from the end (right handle)
      const newEnd = Math.min(this.totalDurationSec, Math.max(this.currentStart() + minSegmentDuration, this.currentEnd() + incrementalTimeDelta));
      this.currentEnd.set(newEnd);

      const updatedSegment = {
        ...this.segment,
        end: newEnd,
      };
      this.segmentChange.emit(updatedSegment);
    }
  };

  private handleResizeEnd = (event: MouseEvent) => {
    this.cleanupResizeListeners();
    this.resizeMode.set('none');
  };

  private handleResizeTouchEnd = (event: TouchEvent) => {
    this.cleanupResizeListeners();
    this.resizeMode.set('none');
    this.touchIdentifier = -1;
  };

  private cleanupResizeListeners(): void {
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
    document.removeEventListener('touchmove', this.handleResizeTouchMove);
    document.removeEventListener('touchend', this.handleResizeTouchEnd);
    document.removeEventListener('touchcancel', this.handleResizeTouchEnd);
    document.body.classList.remove('resizing-segment');
  }
}
