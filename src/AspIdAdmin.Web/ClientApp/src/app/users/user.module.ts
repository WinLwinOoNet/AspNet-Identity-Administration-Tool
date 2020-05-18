import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user-list.component';
import { RouterModule } from '@angular/router';
import { UserDetailComponent } from './user-detail.component';
import { UserEditComponent } from './user-edit.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'users', component: UserListComponent },
      { path: 'users/:id', component: UserDetailComponent },
      { path: 'users/:id/edit', component: UserEditComponent },
    ]),
    AngularMaterialModule
  ],
  providers: [
  ]
})
export class UserModule { }
