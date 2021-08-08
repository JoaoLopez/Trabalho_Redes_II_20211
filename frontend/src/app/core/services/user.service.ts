import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = this.socket.fromEvent<User>('user');
  users = this.socket.fromEvent<User[]>('users');

  constructor(private socket: Socket) { }

  getUser(id: string) {
    this.socket.emit('getUser', id);
  }

  newUser(user: User) {
    this.socket.emit('addUser', user);
  }

  editUser(document: Document) {
    this.socket.emit('editUser', document);
  }
}
