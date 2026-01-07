import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NodeSearchesService } from '../../../services/node-searches.service';
import { NodeCompTypeStr } from '../../../models/flows.model';
import { FlowComponentRefStateService } from '../../../services/flow-component-ref-state.service';
import { AgentNodeComponent } from '../../agent-node/agent-node.component';
import { AgentAudioGeneratorComponent } from '../agent-audio-generator/agent-audio-generator.component';
import { TtsPlaygroundWrapperComponent } from '../tts-playground-wrapper/tts-playground-wrapper.component';
import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';
import { IAssetNodeData } from '../../../models/nodes.model';
import { DynamicNodeWithData } from '../../../services/flow-diagram-state.service';

import { FlowSerializationService } from '../../../services/flow-serialization.service';
import { FlowOrchestrationService } from '../../../services/flow-orchestration.service';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-tts-details',
  standalone: true,
  imports: [CommonModule, AgentAudioGeneratorComponent, TtsPlaygroundWrapperComponent, ButtonModule, TextareaModule, FormsModule],
  templateUrl: './audio-tts-details.html',
  styleUrl: './audio-tts-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioTTsDetailsComponent implements OnInit {
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private nodeSearchesService = inject(NodeSearchesService);
  private flowComponentRefStateService = inject(FlowComponentRefStateService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  private flowOrchestrationService = inject(FlowOrchestrationService);
  private flowSerializationService = inject(FlowSerializationService);
  private flowId = inject(FlowSignalNodeStateService).flow()?.id;

  public node!: DynamicNodeWithData;
  public useAgentGenerator = false;
  public fullAgentCard: any = null;
  public settings: any = { storagePath: 'temporal' };
  public prompt: string = '';

  async ngOnInit() {
    this.node = this.config.data;
    const nodeId = this.node?.id;
    
    if (nodeId) {
      const nodeData = this.node.data?.nodeData;
      this.prompt = nodeData?.prompt || nodeData?.value || '';
      this.settings = nodeData?.settings || { 
        storagePath: 'flows/audios/' + this.flowSignalNodeStateService.flow()?.id 
      };

      const agentNode = this.nodeSearchesService.getFirstInputNodeOfType(nodeId, NodeCompTypeStr.AgentNodeComponent);
      if (agentNode) {
        const agentNodeComponent = this.flowComponentRefStateService.getNodeComponentRef(agentNode.id) as AgentNodeComponent;
        this.fullAgentCard = await agentNodeComponent.getFullAgentCard();
        this.useAgentGenerator = true;
      }
    }
  }

  save() {
    const nodeData = {
      ...this.node.data?.nodeData,
      prompt: this.prompt,
      settings: this.settings
    };

    this.flowSignalNodeStateService.updateNodeData(this.node.id, {
      ...this.node.data,
      nodeData
    });

    if (this.flowId) {
      this.flowOrchestrationService.saveFlow(this.flowId);
    }
    
    this.ref.close(nodeData);
  }

  savePrompt() {
    this.save();
  }

  onTtsGenerated(event: any) {
    console.log('TTS Generated in details:', event);
    const optionalID = event._id || new Date().toISOString();
    const assetNodeData: IAssetNodeData = {
      _id: optionalID,
      id: optionalID,
      name: event.text,
      type: 'audio',
      storage: event.storage,
    };

    this.flowSignalNodeStateService.addAudioNode(assetNodeData, this.node.id);
    this.flowSerializationService.serializeFlow();
    if (this.flowId) {
      this.flowOrchestrationService.saveFlow(this.flowId);
    }
  }

  updateSettings(event: any) {
    this.settings = event;
    
    this.save();
  }

  close() {
    this.save();
  }
}
