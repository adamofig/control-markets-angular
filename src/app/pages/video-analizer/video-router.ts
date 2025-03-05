import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-video-router',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class VideoRouterComponent {
  constructor() {}
}
