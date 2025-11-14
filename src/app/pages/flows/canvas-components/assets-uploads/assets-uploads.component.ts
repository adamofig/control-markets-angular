import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CropperComponentModal, AspectType, ResolutionType, StorageImageSettings, MultiObjectStorageService } from '@dataclouder/ngx-cloud-storage';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';

import { ActivatedRoute, Router } from '@angular/router';

import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { nanoid } from 'nanoid';
import { IAssetNodeData } from '../../models/nodes.model';
import { LoadingBarService } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-assets-uploads',
  templateUrl: './assets-uploads.component.html',
  styleUrls: ['./assets-uploads.component.scss'],
  standalone: true,
  imports: [CropperComponentModal, FileUploadModule, ButtonModule],
})
export class AssetsUploadsComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected toastAlerts = inject(TOAST_ALERTS_TOKEN);
  protected loadingBar = inject(LoadingBarService);
  public isLoading = false;

  public entityId: string | null = null;
  public imageStorageSettings!: StorageImageSettings;
  private flowDiagramStateService = inject(FlowDiagramStateService);
  private multiObjectStorageService = inject(MultiObjectStorageService);

  @Output() imageUploaded = new EventEmitter<IAssetNodeData>();
  @Output() audioUploaded = new EventEmitter<IAssetNodeData>();

  constructor() {
    this.entityId = this.route.snapshot.paramMap.get('id');
    this.imageStorageSettings = {
      path: 'flows/assets/' + this.entityId,
      fileName: undefined,
      cropSettings: { aspectRatio: AspectType.vertical_9_16, resolutions: [ResolutionType.Medium], resizeToWidth: 512 },
    };
  }

  ngOnInit() {
    console.log(this.imageStorageSettings);
  }

  public onImageUploaded(event: any, type: string) {
    console.log('Image uploaded', event, type);

    const asset: IAssetNodeData = {
      id: 'asset-node-' + nanoid(),
      name: 'Asset',
      type: 'image',
      storage: event,
    };
    this.imageUploaded.emit(asset);
  }

  public async uploadAudio(blob: Blob) {
    this.loadingBar.showIndeterminate();
    this.isLoading = true;
    const fileNamePath = `flows/assets/${this.entityId}/audio/${nanoid()}.mp3`;
    const storage = await this.multiObjectStorageService.uploadObject(blob, fileNamePath);
    this.toastAlerts.success({ title: 'Audio uploaded successfully', subtitle: 'Audio uploaded successfully' });
    this.loadingBar.successAndHide();
    this.isLoading = false;
    return storage;
  }

  public async onAudioFileChange(event: any) {
    const file = event.files[0];
    if (!file) {
      return;
    }

    const storage = await this.uploadAudio(file);

    const asset: IAssetNodeData = {
      id: 'asset-node-audio-' + nanoid(),
      name: 'Asset',
      type: 'audio',
      storage,
    };

    this.audioUploaded.emit(asset);
  }

  // Close the modal
}
