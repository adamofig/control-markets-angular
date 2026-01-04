import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FlowExecutionStateService } from './flow-execution-state.service';
import { FlowDiagramStateService } from './flow-diagram-state.service';
import { IFlowExecutionState } from '../models/flows.model';
import { APP_CONFIG } from '@dataclouder/ngx-core';

export type FlowEventType = 'EXECUTION_UPDATE' | 'SYNC_CANVAS' | 'LOG_STREAM';

export interface IFlowEvent {
  event: FlowEventType;
  payload: any;
}

@Injectable({
  providedIn: 'root',
})
export class FlowEventsService {
  private zone = inject(NgZone);
  private flowExecutionStateService = inject(FlowExecutionStateService);
  private flowDiagramStateService = inject(FlowDiagramStateService);
    public appConfig = inject(APP_CONFIG);


  private eventSource: EventSource | null = null;

  /**
   * Subscribes to real-time events for a specific flow.
   * @param flowId The ID of the flow to subscribe to.
   */
  public subscribeToFlow(flowId: string): Observable<IFlowEvent> {
    const url = `${this.appConfig.backendNodeUrl}/api/creative-flowboard/subscribe/${flowId}`;

    return new Observable(observer => {
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data);
            this.handleEvent(data);
            observer.next(data);
          } catch (error) {
            console.error('Error parsing SSE event data:', error);
          }
        });
      };

      this.eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.error('SSE Error:', error);
          observer.error(error);
        });
      };

      return () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
      };
    });
  }

  /**
   * Handles incoming events and updates the appropriate state services.
   */
  private handleEvent(data: any) {
    if (data && data.event) {
      // It's a wrapped IFlowEvent
      const event = data as IFlowEvent;
      switch (event.event) {
        case 'EXECUTION_UPDATE':
          this.handleExecutionUpdate(event.payload);
          break;
        case 'SYNC_CANVAS':
          this.handleSyncCanvas(event.payload);
          break;
        case 'LOG_STREAM':
          // Handle log streaming if needed
          break;
      }
    } else if (data && data.tasks) {
      // It looks like an IFlowExecutionState (based on presence of tasks)
      
      this.handleExecutionUpdate(data as IFlowExecutionState);
    }
  }

  private handleExecutionUpdate(payload: IFlowExecutionState) {
    if (payload) {
      this.flowExecutionStateService.setFlowExecutionState(payload);
      this.flowExecutionStateService.updateJobNodes();
    }
  }

  private handleSyncCanvas(payload: any) {
    // Logic to sync nodes/edges directly if backend sends them
    // For now, this might just be a notification or a full reload
    console.log('SYNC_CANVAS received:', payload);
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
