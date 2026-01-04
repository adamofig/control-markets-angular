import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SseTestService {
  private http = inject(HttpClient);
  
  // Signal to store received messages
  messages = signal<any[]>([]);
  private eventSource: EventSource | null = null;

  connect() {
    if (this.eventSource) return;
    // Using 0.0.0.0:8121 as requested by the user
    this.eventSource = new EventSource('http://0.0.0.0:8121/api/creative-flowboard/subscribe/123');
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messages.update(prev => [...prev, data]);
      } catch (e) {
        console.log('SSE message received (not JSON):', event.data);
        this.messages.update(prev => [...prev, { raw: event.data }]);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.disconnect();
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  emit(message: string) {
    // Using 0.0.0.0:8121 as requested by the user
    return this.http.post('http://0.0.0.0:8121/sse-emit', { message });
  }
}
