import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class VoiceCallService {

  private mediaRecorder: MediaRecorder;
  private canSendVoice = false;
  private host = '';
  private username = '';

  inviteReceived = this.socket.fromEvent<any>('inviteReceived');
  inviteResponded = this.socket.fromEvent<boolean>('inviteResponded');
  callEnded = this.socket.fromEvent<boolean>('callEnded');

  constructor(private socket: Socket) { }

  makeInvite(host: string, username: string) {
    this.host = host;
    this.username = username;
    this.socket.emit('makeInvite', { host, username });
  }

  respondInvite(receiveCall) {
    this.host = receiveCall.host;
    this.username = receiveCall.username;
    this.socket.emit('respondInvite', receiveCall);
  }

  startCall(username: string, time = 1000) {
    this.canSendVoice = true;

    window.navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      let audioChunks = [];

      this.mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener("stop", () => {
        if (this.canSendVoice) {
          let audioBlob = new Blob(audioChunks);

          audioChunks = [];

          let fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = () => {
            let base64String = fileReader.result;
            this.socket.emit("voice", { audio: base64String, username });
          };

          this.mediaRecorder.start();

          setTimeout(() => {
            try {
              this.mediaRecorder.stop();
            } catch {}
          }, time);
        }
      });

      setTimeout(() => {
        try {
          this.mediaRecorder.stop();
        } catch { }
      }, time);
    });
  }

  endCall() {
    this.canSendVoice = false;
    try {
      this.mediaRecorder.stop();
    } catch { }
  }
}
