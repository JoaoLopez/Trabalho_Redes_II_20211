import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { VoiceCallService } from '../services/voice-call.service';

@Component({
  selector: 'app-receiving-call-dialog',
  templateUrl: './receiving-call-dialog.component.html',
  styleUrls: ['./receiving-call-dialog.component.scss']
})
export class ReceivingCallDialogComponent implements OnInit, OnDestroy {

  callAccepted = false;
  private receiveCall = false;

  callEndedSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ReceivingCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private voiceCall: VoiceCallService,
    private socket: Socket) { }

  ngOnInit() {
    console.log(this.data);
    this.callEndedSub = this.voiceCall.callEnded.subscribe(end => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy() {
    this.callEndedSub.unsubscribe();
  }

  acceptInvite() {
    this.callAccepted = true;
    this.receiveCall = true;
    this.voiceCall.respondInvite({ receiveCall: this.receiveCall, ...this.data.invite });
    if (localStorage.getItem('user') === this.data.invite.username) {
        this.voiceCall.startCall(this.data.invite.host);
    } else {
      this.voiceCall.startCall(this.data.invite.username);
    }
  }

  rejectInvite() {
    this.voiceCall.respondInvite({ receiveCall: this.receiveCall, ...this.data.invite });
    this.dialogRef.close();
  }

  endCall() {
    this.socket.emit('endCall', { host: this.data.invite.host, username: this.data.invite.username });
  }

}
