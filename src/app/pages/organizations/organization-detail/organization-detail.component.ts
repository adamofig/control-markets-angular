import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { OrganizationService } from '../organizations.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { IOrganization } from '../models/organizations.model';

@Component({
  selector: 'app-organization-detail',
  imports: [JsonPipe],
  templateUrl: './organization-detail.component.html',
  styleUrl: './organization-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationDetailComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private activatedRoute = inject(ActivatedRoute);

  public organizationId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public organization = signal<IOrganization | null>(null);

  ngOnInit(): void {
    this.loadOrganization();
  }

  private async loadOrganization() {
    const organization = await this.organizationService.findOne(this.organizationId);
    this.organization.set(organization);
  }
}
