import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CropperComponentModal, AspectType, ResolutionType, StorageImageSettings, ImgStorageData } from '@dataclouder/ngx-cloud-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { nanoid } from 'nanoid';
import { IAssetNodeData } from '../../models/nodes.model';

@Component({
  selector: 'app-assets-uploads',
  templateUrl: './assets-uploads.component.html',
  styleUrls: ['./assets-uploads.component.scss'],
  standalone: true,
  imports: [CropperComponentModal],
})
export class AssetsUploadsComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  public entityId: string | null = null;
  public imageStorageSettings!: StorageImageSettings;
  private flowDiagramStateService = inject(FlowDiagramStateService);

  @Output() imageUploaded = new EventEmitter<IAssetNodeData>();

  constructor() {
    this.entityId = this.route.snapshot.paramMap.get('id');
    this.imageStorageSettings = {
      path: 'flows/assets/' + this.entityId,
      fileName: undefined,
      cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.Medium], resizeToWidth: 512 },
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

  // Close the modal
}
