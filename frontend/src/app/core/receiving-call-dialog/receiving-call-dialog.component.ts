import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-receiving-call-dialog',
  templateUrl: './receiving-call-dialog.component.html',
  styleUrls: ['./receiving-call-dialog.component.scss']
})
export class ReceivingCallDialogComponent implements OnInit {

  private receiveCall = false;

  constructor(public dialogRef: MatDialogRef<ReceivingCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }

  acceptInvite() {
    this.receiveCall = true;
    this.dialogRef.close({ receiveCall: this.receiveCall });
  }

  rejectInvite() {
    this.dialogRef.close({ receiveCall: this.receiveCall });
  }

}
