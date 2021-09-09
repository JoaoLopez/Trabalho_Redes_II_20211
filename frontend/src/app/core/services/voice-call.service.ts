import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class VoiceCallService {

  private mediaRecorder: MediaRecorder;
  private canSendVoice = false;

  inviteReceived = this.socket.fromEvent<string>('inviteReceived');

  constructor(private socket: Socket) { }

  makeInvite(host: string, username: string) {
    this.socket.emit('makeInvite', { host, username });
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
            console.log('stop2');
            this.mediaRecorder.stop();
          }, time);
        }
      });

      setTimeout(() => {
        console.log('stop1');
        this.mediaRecorder.stop();
      }, time);
    });
  }

  endCall() {
    this.canSendVoice = false;
    this.mediaRecorder.stop();
  }
}
