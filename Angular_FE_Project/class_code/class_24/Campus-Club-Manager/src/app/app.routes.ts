import { Routes, UrlTree, Router } from '@angular/router';
import { inject } from '@angular/core';

import { ClubListComponent } from './clubs/club-list/club-list.component';
import { ClubNewComponent } from './clubs/club-new/club-new.component';
import { ClubDetailComponent } from './clubs/club-detail/club-detail.component';
import { ClubEditComponent } from './clubs/club-edit/club-edit.component';
import { ImportExportComponent } from './shared/tools/import-export.component';
import { MembersOverviewComponent } from './clubs/members-overview/members-overview.component';
import { LoginComponent } from './auth/login.component';
import { AuthService } from './shared/services/auth.service';
import { UsersAdminComponent } from './admin/users-admin.component';

export function adminOnly(): true | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.createUrlTree(['/login']);
}

export function authOnly(): true | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user() ? true : router.createUrlTree(['/login']);
}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ClubListComponent, canActivate: [authOnly] },
  { path: 'clubs/new', component: ClubNewComponent, canActivate: [adminOnly] },
  {
    path: 'clubs/:id',
    component: ClubDetailComponent,
    canActivate: [authOnly],
  },
  {
    path: 'clubs/:id/edit',
    component: ClubEditComponent,
    canActivate: [adminOnly],
  },
  {
    path: 'members',
    component: MembersOverviewComponent,
    canActivate: [authOnly],
  },
  {
    path: 'admin/users',
    component: UsersAdminComponent,
    canActivate: [adminOnly],
  },
  { path: 'tools', component: ImportExportComponent, canActivate: [adminOnly] },
  { path: '**', redirectTo: '' },
];
