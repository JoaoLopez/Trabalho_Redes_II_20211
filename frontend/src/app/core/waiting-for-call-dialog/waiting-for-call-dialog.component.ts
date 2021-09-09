import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { VoiceCallService } from '../services/voice-call.service';

@Component({
  selector: 'app-waiting-for-call-dialog',
  templateUrl: './waiting-for-call-dialog.component.html',
  styleUrls: ['./waiting-for-call-dialog.component.scss']
})
export class WaitingForCallDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WaitingForCallDialogComponent>,
    private voiceCall: VoiceCallService) { }

  ngOnInit() {
    this.voiceCall.inviteResponded.subscribe(response => {
      this.dialogRef.close(response);
    });
  }

}
