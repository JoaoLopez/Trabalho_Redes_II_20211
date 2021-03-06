import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { VoiceCallService } from '../services/voice-call.service';
import { WaitingForCallDialogComponent } from '../waiting-for-call-dialog/waiting-for-call-dialog.component';

/** Componente responsável pela busca de usuários da aplicação */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  /** Formulário de busca */
  userSearch: FormGroup;
  /** Resultado da pesquisa */
  searchResult = '';
  callStarted = false;
  callStatus = '';

  /** Listener do resultado da busca retornada pelo backend */
  private searchSub: Subscription;
  private callEndedSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private voiceCall: VoiceCallService,
    private socket: Socket) {
    /** Inicialização do formulário com um valor padrão */
    this.userSearch = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
    });
  }

  ngOnInit() {
    /* Inicializa o listener de resultado da busca emitido pelo backend */
    this.searchSub = this.userService.searchUser.subscribe(searchResult => {
      console.log(searchResult);
      this.searchResult = searchResult;
    });
    this.callEndedSub = this.voiceCall.callEnded.subscribe(end => {
      this.callStatus = 'Chamada encerrada';
      this.callStarted = false;
      this.clearCallStatus();
    });
  }

  ngOnDestroy() {
    /* Remove o listeners de evento do backend quando o componente é removido da tela, para evitar memory leaks */
    this.searchSub.unsubscribe();
    this.callEndedSub.unsubscribe();
  }

  /** Evento disparado ao se clicar no botão 'Buscar' */
  onFormSubmit() {
    const userName = this.userSearch.get('name').value;
    this.searchResult = '';
    if (localStorage.getItem('user') === userName)
      return;
    this.userService.getUser(userName);
  }

  makeInvite() {
    this.dialog.open(WaitingForCallDialogComponent, { disableClose: true })
      .afterClosed().subscribe(response => {
        if (response) {
          this.startCall();
          this.callStatus = 'Ligação em andamento';
        } else {
          this.callStatus = 'Chamada recusada';
          this.clearCallStatus();
        }
      });
    this.voiceCall.makeInvite(localStorage.getItem('user'), this.userSearch.get('name').value);
  }

  startCall() {
    this.voiceCall.startCall(this.userSearch.get('name').value);
    this.callStarted = true;
  }

  endCall() {
    this.callStatus = 'Chamada encerrada';
    this.socket.emit('endCall', { host: localStorage.getItem('user'), username: this.userSearch.get('name').value });
    this.callStarted = false;
    this.clearCallStatus();
  }

  private clearCallStatus() {
    setTimeout(() => {
      this.callStatus = '';
    }, 3000);
  }
}
