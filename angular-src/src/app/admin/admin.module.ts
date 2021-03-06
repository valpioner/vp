import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersModule } from './manage-users/manage-users.module';

import { AdminComponent, AdminDashboardComponent, ManageCoursesComponent, AdminService } from '.';

import { AdminRoutingModule } from './admin.routing.module';
import { AdminGuard } from '../guards'

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ManageUsersModule
  ],
  providers: [
    AdminService,
    AdminGuard
  ],
  declarations: [AdminComponent, AdminDashboardComponent, ManageCoursesComponent]
})
export class AdminModule { }
