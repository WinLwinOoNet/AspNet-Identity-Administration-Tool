import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { RouterModule } from '@angular/router';
import { UserDetailComponent } from './user-detail.component';
import { UserEditComponent } from './user-edit.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'users', component: UserListComponent },
      { path: 'users/:id', component: UserDetailComponent },
      { path: 'users/:id/edit', component: UserEditComponent },
    ])
  ], 
  providers: [
    
  ]
})
export class UserModule { }
