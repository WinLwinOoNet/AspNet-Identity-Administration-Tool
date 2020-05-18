import { NgModule, SkipSelf, Optional } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    RouterModule,
    AngularMaterialModule
  ], 
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ]
})
export class SharedModule { 
  
  constructor(@Optional() @SkipSelf() parentModule: SharedModule) {
    if (parentModule) {
      throw new Error(`${parentModule.constructor.name} has already been loaded. Import this module in the AppModule only.`);
    }
  }
}
