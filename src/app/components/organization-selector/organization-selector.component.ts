import { Component, EventEmitter, computed, inject, Output, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppUserService, IUserOrganization } from 'src/app/services/app-user.service';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-organization-selector',
  templateUrl: './organization-selector.component.html',
  styleUrls: ['./organization-selector.component.scss'],
  standalone: true,
  imports: [SelectModule, TranslateModule, CardModule, ReactiveFormsModule],
})
export class OrganizationSelectorComponent {
  public userService = inject(AppUserService);
  private toastService = inject(TOAST_ALERTS_TOKEN);
  @Output() organizationUpdated = new EventEmitter<void>();
  public organizationControl = new FormControl<string | null>(this.userService.user()?.defaultOrgId || null);

  public organizations = computed(() => {
    debugger;
    const userOrgs = this.userService.user()?.organizations || [];
    return [{ name: 'Personal Space', orgId: this.userService.user().id }, ...userOrgs] as IUserOrganization[];
  });

  constructor() {
    effect(() => {
      this.organizationControl.setValue(this.userService.user()?.defaultOrgId || null, { emitEvent: false });
    });
  }

  async updateDefaultOrganization(orgId: string | null) {
    debugger;
    const userUpdate = { defaultOrgId: orgId, id: this.userService.user()?.id };

    await this.userService.updatePartialUserServer(userUpdate);

    this.toastService.info({
      title: 'Organization updated successfully',
      subtitle: 'Organization updated successfully',
    });

    this.organizationUpdated.emit();
  }
}
