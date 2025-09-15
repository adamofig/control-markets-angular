import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { CustomOutcomeNode } from '../outcome-node/outcome-node.component';
import { TTSPlayground } from '@dataclouder/ngx-vertex';

@Component({
  selector: 'app-audio-tts-node-component',
  imports: [TTSPlayground],
  templateUrl: './audio-tts-node.html',
  styleUrl: './audio-tts-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioTTsNodeComponent extends BaseFlowNode<CustomOutcomeNode> {}
