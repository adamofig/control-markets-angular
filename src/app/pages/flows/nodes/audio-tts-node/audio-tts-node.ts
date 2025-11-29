import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { TtsPlaygroundComponent, TTSPlaygroundSettings } from '@dataclouder/ngx-ai-services';
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
import { TtsPlaygroundWrapperComponent } from './tts-playground-wrapper/tts-playground-wrapper.component';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { NodeTypeStr } from '../../models/flows.model';
import { AgentAudioGeneratorComponent } from './agent-audio-generator/agent-audio-generator.component';
import { AgentNodeComponent } from '../agent-node/agent-node.component';

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
  @ViewChild('ttsPlayground') public ttsPlayground: TtsPlaygroundComponent | undefined;
  public dialogService = inject(DialogService);
  public storagePath = 'flows/audios/' + this.flowSignalNodeStateService.flow()?.id;

  public agentSource = signal<any>(null);

  public value = '';

  public settings = signal<TTSPlaygroundSettings>({
    storagePath: this.storagePath,
  });

  private toastService = inject(TOAST_ALERTS_TOKEN);

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

  async onTtsGenerated(event: any) {
    console.log('tts generated', event);

    const optionalID = event._id || new Date().toISOString();

    const assetNodeData: IAssetNodeData = {
      _id: optionalID,
      id: optionalID,
      name: event.text,
      type: 'audio',
      storage: event.storage,
    };

    this.flowSignalNodeStateService.addAudioNode(assetNodeData, this.node()?.id);
    // A ver que hago con el audio?
  }

  public updateAudioNodeSettings(event: any) {
    this.settings.set(event);
    this.toastService.success({
      title: 'Settings Updated',
      subtitle: 'The audio node settings have been successfully updated.',
    });
  }

  public async openModal() {
    console.log('Buscar quien si tiene un agente contetado');

    const agentNode = this.nodeSearchesService.getFirstInputNodeOfType(this.node()?.id, NodeTypeStr.AgentNodeComponent);

    if (agentNode) {
      const agentNodeComponent = this.flowComponentRefStateService.getNodeComponentRef(agentNode?.id!) as AgentNodeComponent;
      const fullAgentCard = await agentNodeComponent.getFullAgentCard();

      console.log('agentCard', fullAgentCard);

      console.log('Se encontro un node. de agente. abrir otro modal  ', agentNode);
      const ref = this.dialogService.open(AgentAudioGeneratorComponent, {
        header: 'Generate Audio from Agent',
        width: '450px',
        closable: true,
        draggable: true,
        modal: false,
        styleClass: 'draggable-dialog',
        inputValues: {
          fullAgentCard: fullAgentCard,
        },
        data: {
          ttsGenerated: (event: any) => this.onTtsGenerated(event),
        },
      });

      if (ref) {
        ref.onClose.subscribe(result => {});
      }
      return;
    }

    const ref = this.dialogService.open(TtsPlaygroundWrapperComponent, {
      header: 'TTS Playground',
      width: '650px',
      modal: false,
      data: {
        onTtsGenerated: (event: any) => this.onTtsGenerated(event),
        onFormValues: (event: any) => this.updateAudioNodeSettings(event),
      },
      inputValues: {
        settings: this.settings(),
      },
      closable: true,
      draggable: true,
      styleClass: 'draggable-dialog',
    });

    if (ref) {
      ref.onClose.subscribe((result: any) => {
        if (result && result.settings) {
          this.settings.set(result.settings);
        }
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
