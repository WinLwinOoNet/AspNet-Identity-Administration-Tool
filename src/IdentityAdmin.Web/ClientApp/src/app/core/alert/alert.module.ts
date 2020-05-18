import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './alert.service';

@NgModule({
  imports: [CommonModule],
  providers: [AlertService]
})
export class AlertModule {

  constructor(@Optional() @SkipSelf() parentModule: AlertModule) {
    if (parentModule) {
      throw new Error(`${parentModule.constructor.name} has already been loaded. Import this module in the AppModule only.`);
    }
  }
}
