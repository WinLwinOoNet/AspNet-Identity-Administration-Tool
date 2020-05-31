import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { AngularMaterialModule } from '../../angular-material.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule
  ],
  exports: [ModalComponent],
  declarations: [ModalComponent],
  providers: [ModalService],
  entryComponents: [ModalComponent]
})
export class ModalModule {

  constructor(@Optional() @SkipSelf() parentModule: ModalModule) {
    if (parentModule) {
      throw new Error(`${parentModule.constructor.name} has already been loaded. Import this module in the AppModule only.`);
    }
  }
}
