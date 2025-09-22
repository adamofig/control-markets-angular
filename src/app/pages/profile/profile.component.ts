import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanType, PermissionType, RolType } from '../../dc-user-module/user.class';

import { IUser, ProfileFormComponent, ProfileSettingsFormComponent } from '@dataclouder/ngx-users';
import { AudioSpeed, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { AppUserService } from 'src/app/services/app-user.service';
import { CardModule } from 'primeng/card';
import { DCConversationUserChatSettingsComponent } from '@dataclouder/ngx-agent-cards';

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
  imports: [IonicModule, ReactiveFormsModule, ProfileFormComponent, ProfileSettingsFormComponent, CardModule, DCConversationUserChatSettingsComponent],
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

  profileForm = this.fb.group({
    id: [''],
    urlPicture: [''],
    email: [''],
    personalData: this.fb.group({
      nickname: [''],
      username: [''],
      firstname: [''],
      lastname: [''],
      gender: [''],
      birthday: [null],
      emotionalName: [''],
    }),
  });

  constructor() {
    const user = this.userService.user();
    if (user) {
      // this.profileForm.patchValue(user);
    }
  }

  ngOnInit() {}

  onSubmit() {
    // if (this.profileForm.valid) {
    //   const userData: IUser = this.profileForm.value;
    //   console.log('Form submitted:', userData);
    //   // this.userService.updateUser(userData);
    //   this.toastService.success({ title: 'Profile updated', subtitle: 'Your profile has been updated successfully' });
    //   // Handle form submission
    // } else {
    //   console.log('Form is invalid');
    //   this.toastService.error({ title: 'Form is invalid', subtitle: 'Please fill in all the fields' });
    // }
  }

  get nickname() {
    return this.profileForm.get('personalData.nickname');
  }

  public saveData(event: any) {
    console.log(event);
  }
}
