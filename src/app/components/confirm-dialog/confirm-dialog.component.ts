import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  buttons: {confirm: string, discard: string} = {confirm:"", discard:""}

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string, message: string, confirm: string|undefined, discard: string|undefined}) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.buttons.confirm = data.confirm ?? "Да";
    this.buttons.discard = data.discard ?? "Нет";
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
