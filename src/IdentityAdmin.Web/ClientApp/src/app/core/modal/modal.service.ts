import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from './modal.component';
import { Observable } from 'rxjs';

export interface IModalContent {
  header?: string;
  body?: string;
  cancelButtonText?: string;
  OKButtonText?: string;
  cancelButtonVisible?: boolean;
}

@Injectable()
export class ModalService {

  dialogRef: MatDialogRef<ModalComponent, any>;

  constructor(public dialog: MatDialog) { }

  show(modalContent: IModalContent): Observable<boolean> {
    this.dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: modalContent
    });

    return this.dialogRef.afterClosed();
  }

  hide(): void {
    this.dialogRef.close();
  }
}
