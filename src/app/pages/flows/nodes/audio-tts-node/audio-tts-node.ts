import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { CustomOutcomeNode } from '../outcome-node/outcome-node.component';
import { TTSPlayground } from '@dataclouder/ngx-vertex';
import { FlowSignalNodeStateService } from '../../services/flow-signal-node-state.service';
import { IAssetNodeData } from '../../models/nodes.model';

@Component({
  selector: 'app-audio-tts-node-component',
  imports: [TTSPlayground],
  templateUrl: './audio-tts-node.html',
  styleUrl: './audio-tts-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioTTsNodeComponent extends BaseFlowNode<CustomOutcomeNode> {
  public flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  public storagePath = 'flows/audios/' + this.flowSignalNodeStateService.flow()?.id;
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
}
