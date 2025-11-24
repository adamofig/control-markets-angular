import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProfileFormComponent, ProfileSettingsFormComponent } from '@dataclouder/ngx-users';
import { AudioSpeed, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { AppUserService } from 'src/app/services/app-user.service';
import { CardModule } from 'primeng/card';
import { DCConversationUserChatSettingsComponent } from '@dataclouder/ngx-agent-cards';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationSelectorComponent } from 'src/app/components/organization-selector/organization-selector.component';

export const BaseLanguagesOptions = [
  { name: 'Español 🇪🇦 🇲🇽 ', code: 'es' },
  { name: 'Inglés 🇺🇸 🇬🇧 ', code: 'en' },
];

export const AudioSpeedOptions = [
  { name: 'Muy Lento', code: AudioSpeed.VerySlow },
  { name: 'Lento', code: AudioSpeed.Slow },
  { name: 'Normal', code: AudioSpeed.Regular },
  { name: 'Rápida', code: AudioSpeed.Fast },
];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    ProfileFormComponent,
    ProfileSettingsFormComponent,
    CardModule,
    DCConversationUserChatSettingsComponent,
    TranslateModule,
    OrganizationSelectorComponent,
  ],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  public userService = inject(AppUserService);
  private toastService = inject(TOAST_ALERTS_TOKEN);
  public hiddenFields = { targetLanguage: true };
  public audioSpeedOptions = AudioSpeedOptions;

  public userForm = this.fb.group({
    firstname: [<string>'', Validators.required],
    lastname: [<string>''],
    reasons: [<string>''],
    birthday: [<Date | null>null],
    username: [<string>''],
    gender: [<string>''],
    emotionalName: [<string>''],
  });

  public baseLanguagesOptions = BaseLanguagesOptions;

  public settingsForm = this.fb.group({
    enableNotifications: [false],
    audioSpeed: [1],
    baseLanguage: [''],
    targetLanguage: [''],
    // conversation will be added in child
  });

  constructor() {
    const user = this.userService.user();
  }

  ngOnInit() {
    this.userService.user().organizations;
  }

  public saveData(event: any) {
    console.log(event);
  }
}
