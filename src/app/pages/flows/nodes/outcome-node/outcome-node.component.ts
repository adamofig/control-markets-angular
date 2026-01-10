import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { IAgentOutcomeJob, ResponseFormat } from 'src/app/pages/jobs/models/jobs.model';
import { FlowComponentRefStateService } from '../../services/flow-component-ref-state.service';

@Component({
  selector: 'app-outcome-node',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './outcome-node.component.html',
  styleUrl: './outcome-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeNodeComponent implements OnInit {
  @Input() nodeData: IAgentOutcomeJob | null = null;
  @Input() inputNodeId: string = '';
  
  // Also support direct inputs if the wrapper maps them
  @Input() result: any = null;
  @Input() responseFormat?: ResponseFormat;
  @Input() response?: any;

  private flowComponentRefStateService = inject(FlowComponentRefStateService);

  public responseFormatEnum = ResponseFormat;
  public backgroundImageUrl = signal<string>('assets/defaults/images/default_2_3.webp');
  public displayData = computed(() => {
    return this.nodeData || {
      result: this.result,
      responseFormat: this.responseFormat,
      response: this.response
    };
  });

  ngOnInit(): void {
    if (this.inputNodeId) {
      setTimeout(() => {
        const inputNodeComponent = this.flowComponentRefStateService.getNodeComponentRef(this.inputNodeId);
        const imageForInput = inputNodeComponent?.data()?.nodeData?.assets?.image?.url;
        if (imageForInput) {
          this.backgroundImageUrl.set(imageForInput);
        }
      }, 500);
    }
  }
}
