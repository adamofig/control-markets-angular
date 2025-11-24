import { Injectable, Signal, computed, inject } from '@angular/core';
import { IUser, UserService } from '@dataclouder/ngx-users';

export interface IUserOrganization {
  orgId: string;
  name: string;
  roles: string[]; // For Future use, user may have specific roles in the organization.
}

interface IAppUser extends IUser {
  defaultOrgId?: string | null;
  organizations?: IUserOrganization[];
}

@Injectable({
  providedIn: 'root',
})
export class AppUserService extends UserService<IAppUser> {
  public currentOrganization: Signal<IUserOrganization | undefined>;
  constructor() {
    super();
    console.log(`%c AppUserService instantiated: ${Math.random()}`, 'color: #ff00ff; font-weight: bold; padding: 2px 4px; border: 1px solid #ff00ff;');
    this.currentOrganization = computed(() => {
      const user = this.user();
      if (!user) {
        return undefined;
      }
      if (user.defaultOrgId === null) {
        return { orgId: null, name: 'Personal Space', roles: [] } as any;
      }
      if (user.defaultOrgId && user.organizations) {
        return user.organizations.find(org => org.orgId === user.defaultOrgId);
      }
      return { orgId: this.user()?._id, name: 'Personal Space', roles: [] } as any;
    });
  }

  override getUserDataInformation(): string {
    console.warn('NO USER DATA YET getUserDataInformation in app-user.service.ts for the app');
    return 'There is no user data yet';
  }
}
