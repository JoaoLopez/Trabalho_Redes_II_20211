import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { User } from '../interfaces/user.interface';

/** Classe de serviço responsável pela comunicação do frontend com o WebSocket */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /* Listeners de eventos emitidos pelo backend */
  currentUser = this.socket.fromEvent<User>('user');
  searchUser = this.socket.fromEvent<string>('search');
  remove = this.socket.fromEvent<string>('remove');
  events = this.socket.fromEvent<string>('events');
  errors = this.socket.fromEvent<string>('errors');
  users = this.socket.fromEvent<User[]>('users');

  constructor(private socket: Socket) { }

  /** Buscar um usuário pelo seu nome */
  getUser(name: string) {
    this.socket.emit('getUser', name);
  }

  /** Cadastrar um usuário */
  newUser(user: User) {
    this.socket.emit('addUser', user);
  }

  /** Remover um usuário/encerramento de conexão */
  removeUser(name: string) {
    this.socket.emit('removeUser', name);
  }
}
