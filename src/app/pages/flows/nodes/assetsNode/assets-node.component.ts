import { Component, inject, OnInit } from '@angular/core';
import { CropperComponentModal, AspectType, ResolutionType, StorageImageSettings } from '@dataclouder/ngx-cloud-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNodeComponent } from 'ngx-vflow';
import { CustomTaskNode } from '../task-node/task-node';

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [CropperComponentModal],
})
export class AssetsNodeComponent extends CustomNodeComponent<CustomTaskNode> implements OnInit {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  public entityId: string | null = null;
  public imageStorageSettings!: StorageImageSettings;

  constructor() {
    super();
    this.entityId = this.route.snapshot.paramMap.get('id');
    // this.imageStorageSettings = {
    //   path: 'flows/assets/' + this.entityId,
    //   fileName: undefined,
    //   cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.Medium], resizeToWidth: 512 },
    // };
  }

  override ngOnInit() {
    console.log(this.imageStorageSettings);
  }

  public onImageUploaded(event: any, type: string) {
    console.log('Image uploaded', event, type);
  }
}
