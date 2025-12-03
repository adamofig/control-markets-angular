import { CommonModule } from '@angular/common';

import { Component, effect, inject } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';

import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { MessageContent, MessageContentDisplayer, TranscriptionsWhisper } from '@dataclouder/ngx-agent-cards';
import { AiWhisperService } from '@dataclouder/ngx-ai-services';
import { Tag } from 'primeng/tag';
import { TagModule } from 'primeng/tag';

import { BaseFlowNode } from '../base-flow-node';
import { Button } from 'primeng/button';
import { IAssetNodeData, IAudioAssetsNodeData } from '../../models/nodes.model';

import { StatusJob } from '../../models/flows.model';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { AudioDetailsComponent } from './audio-details/audio-details';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingBarService } from '@dataclouder/ngx-core';

export interface CustomAudioNode extends ComponentDynamicNode {
  nodeData: IAudioAssetsNodeData;
}

@Component({
  selector: 'app-audio-node',
  templateUrl: './audio-node.component.html',
  styleUrls: ['./audio-node.component.scss'],
  standalone: true,
  imports: [HandleComponent, Button, Tag, TagModule, BaseNodeToolbarComponent, CommonModule, MessageContentDisplayer],
})
export class AudioNodeComponent extends BaseFlowNode<CustomAudioNode> {
  private toastService = inject(TOAST_ALERTS_TOKEN);
  private whisperService = inject(AiWhisperService);
  private dialogService = inject(DialogService);
  public hasTranscription = false;
  public transcription: any;
  private loadingBar = inject(LoadingBarService);

  constructor() {
    super();
    effect(() => {
      const job = this.jobExecutionState();
      if (job) {
        console.log('jobExecutionState changed', job);
        if (job.status === StatusJob.FAILED) {
          this.toastService.error({ title: 'Error', subtitle: job.statusDescription || 'Error al ejecutar el job' });
        }
        //
      }
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    console.log('audio-node', this.node()?.data?.nodeData);
    this.transcription = this.node()?.data?.nodeData?.transcription;
    this.hasTranscription = !!this.transcription;
    this.buildBaseMessage();
  }

  private buildBaseMessage(): void {
    const nodeData = this.node()?.data?.nodeData;
    if (nodeData) {
      this.baseMessage = {
        messageId: nodeData.id,
        text: nodeData.transcription?.text || nodeData.name,
        audioUrl: nodeData.storage?.url,
        transcription: nodeData.transcription,
      };
    }
  }

  public openModal() {
    // this.audioDetailsService.open(this.node());

    this.dialogService.open(AudioDetailsComponent, {
      header: 'Audio Node Details',
      contentStyle: { 'max-height': '90vh', padding: '0px' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      width: '500px',
      modal: false,
      duplicate: true,

      inputValues: {
        nodeData: this.node()?.data?.nodeData,
      },
      maximizable: true,
    });
  }

  public async getTranscriptions() {
    this.loadingBar.showIndeterminate();
    const transcription = await this.whisperService.transcribe(this.node()?.data?.nodeData?.storage?.url || '');
    console.log('transcription', transcription);
    const nodeMetadata = { ...this.node()?.data, nodeData: { ...this.node()?.data?.nodeData, transcription } };

    this.flowSignalNodeStateService.updateNodeData(this.node().id, nodeMetadata);
    this.hasTranscription = true;
    this.transcription = transcription;
    this.buildBaseMessage();
    this.loadingBar.successAndHide();
    return transcription;
  }

  public playAudio() {
    const audioUrl = this.node()?.data?.nodeData?.storage?.url;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }

  baseMessage: MessageContent | undefined;
}
