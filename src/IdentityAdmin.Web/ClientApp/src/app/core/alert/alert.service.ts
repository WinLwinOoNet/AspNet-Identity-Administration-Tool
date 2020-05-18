import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AlertService {

  timeOut = 5000;

  constructor(private snackBar: MatSnackBar) { }

  alert(message: any, alertType: AlertType): void {
    const cssClass = `alert-${AlertType[alertType].toLowerCase()}`;

    if (message instanceof Object) {
      message = JSON.stringify(message, null, 2);
    }

    this.snackBar.open(message, 'x', {
      duration: this.timeOut,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [cssClass]
    });
  }

  success(message: any) {
    this.alert(message, AlertType.Success);
  }

  danger(message: any) {
    this.alert(message, AlertType.Danger);
  }

  warning(message: any) {
    this.alert(message, AlertType.Warning);
  }

  info(message: any) {
    this.alert(message, AlertType.Info);
  }
}

export enum AlertType {
  Success,
  Danger,
  Warning,
  Info
}
