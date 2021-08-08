import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = this.socket.fromEvent<User>('user');
  searchUser = this.socket.fromEvent<string>('search');
  events = this.socket.fromEvent<string>('events');
  errors = this.socket.fromEvent<string>('errors');
  users = this.socket.fromEvent<User[]>('users');

  constructor(private socket: Socket) { }

  getUser(name: string) {
    this.socket.emit('getUser', name);
  }

  newUser(user: User) {
    this.socket.emit('addUser', user);
  }

  editUser(document: Document) {
    this.socket.emit('editUser', document);
  }
}
