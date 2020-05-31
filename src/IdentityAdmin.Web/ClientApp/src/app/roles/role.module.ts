import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoleListComponent } from './role-list.component';
import { RoleDetailComponent } from './role-detail.component';
import { RoleEditComponent } from './role-edit.component';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleDetailComponent,
    RoleEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'roles', component: RoleListComponent },
      { path: 'roles/:id', component: RoleDetailComponent },
      { path: 'roles/:id/edit', component: RoleEditComponent },
    ]),
    AngularMaterialModule
  ],
  providers: [
  ]
})
export class RoleModule { }
