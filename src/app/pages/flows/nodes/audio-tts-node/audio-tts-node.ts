import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { TtsPlaygroundComponent, TTSPlaygroundSettings } from '@dataclouder/ngx-vertex';
import { FlowSignalNodeStateService } from '../../services/flow-signal-node-state.service';
import { IAssetNodeData } from '../../models/nodes.model';
import { ComponentDynamicNode, Vflow } from 'ngx-vflow';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { CommonModule } from '@angular/common';

export interface CustomAudioTTsNode extends ComponentDynamicNode {
  nodeData: { value: string; settings: any };
  inputNodeId: string;
  processNodeId: string;
}

@Component({
  selector: 'app-audio-tts-node-component',
  imports: [Vflow, TtsPlaygroundComponent, TextareaModule, FormsModule, ButtonModule, DialogModule, BaseNodeToolbarComponent, CommonModule],
  templateUrl: './audio-tts-node.html',
  styleUrl: './audio-tts-node.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioTTsNodeComponent extends BaseFlowNode<CustomAudioTTsNode> implements OnInit {
  public flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  @ViewChild('ttsPlayground') public ttsPlayground: TtsPlaygroundComponent | undefined;
  public dialogService = inject(DialogService);

  public storagePath = 'flows/audios/' + this.flowSignalNodeStateService.flow()?.id;

  public agentSource = signal<any>(null);

  public value = '';

  public settings = signal<TTSPlaygroundSettings>({
    storagePath: this.storagePath,
  });

  constructor() {
    super();
    effect(() => {
      const agentSource = this.flowSignalNodeStateService.edges().find(edge => edge.target === this.node()?.id);
      if (agentSource) {
        console.log('Se encontro un node. de agente. ', agentSource);
        this.agentSource.set(agentSource);
      }
      if (this.node()?.data?.nodeData?.settings) {
        this.settings.set(this.node()?.data?.nodeData?.settings);
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

  public openModal() {
    const ref = this.dialogService.open(TtsPlaygroundComponent, {
      header: 'TTS Playground',
      width: '650px',
      data: {
        settings: this.settings(),
      },
      closable: true,
      draggable: true,
      styleClass: 'draggable-dialog',
    });

    if (ref) {
      ref.onClose.subscribe((result: any) => {
        if (result) {
          this.onTtsGenerated(result);
        }
      });
    }
  }

  public generateTTS() {
    // this.flowSignalNodeStateService.generateTTS(this.value);
    alert('generateTTS');
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
