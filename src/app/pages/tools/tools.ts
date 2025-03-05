import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolsService } from './tools.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './tools.html',
  styleUrl: './tools.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent implements OnInit {
  constructor(private toolsService: ToolsService) {}
  url: string = '';
  ngOnInit(): void {
    console.log('ToolsComponent');
  }

  public async downloadYoutubeSong() {
    console.log('downloadYoutubeSong');
    const res = await this.toolsService.donwloadSong(this.url);
    console.log('res', res);
  }
}
