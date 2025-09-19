import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { CustomOutcomeNode } from '../outcome-node/outcome-node.component';
import { TTSPlayground } from '@dataclouder/ngx-vertex';
import { FlowSignalNodeStateService } from '../../services/flow-signal-node-state.service';
import { IAssetNodeData } from '../../models/nodes.model';
import { Vflow } from 'ngx-vflow';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-audio-tts-node-component',
  imports: [Vflow, TTSPlayground, TextareaModule, FormsModule, ButtonModule],
  templateUrl: './audio-tts-node.html',
  styleUrl: './audio-tts-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioTTsNodeComponent extends BaseFlowNode<CustomOutcomeNode> implements OnInit {
  public flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  public storagePath = 'flows/audios/' + this.flowSignalNodeStateService.flow()?.id;

  public agentSource = signal<any>(null);

  public value = '';

  constructor() {
    super();
    effect(() => {
      const agentSource = this.flowSignalNodeStateService.edges().find(edge => edge.target === this.node()?.id);
      if (agentSource) {
        console.log('Se encontro un node. de agente. ', agentSource);
        this.agentSource.set(agentSource);
      }
    });
  }

  onTtsGenerated(event: any) {
    console.log('tts generated', event);

    const optionalID = event._id || new Date().toISOString();

    const assetNodeData: IAssetNodeData = {
      _id: optionalID,
      id: optionalID,
      name: event.text,
      type: 'audio',
      storage: event.storage,
    };
    this.flowSignalNodeStateService.addAssetNode(assetNodeData, this.node()?.id);
    // A ver que hago con el audio?
  }

  public generateTTS() {
    // this.flowSignalNodeStateService.generateTTS(this.value);
    alert('generateTTS');
  }

  overridengOnInit(): void {
    super.ngOnInit();
    console.log('ngOnInit');
  }
}
