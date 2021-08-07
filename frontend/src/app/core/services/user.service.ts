import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentDocument = this.socket.fromEvent<Document>('user');
  documents = this.socket.fromEvent<string[]>('users');

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit('getUser', id);
  }

  newDocument() {
    this.socket.emit('addUser', { id: this.userId(), doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit('editUser', document);
  }

  private userId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
