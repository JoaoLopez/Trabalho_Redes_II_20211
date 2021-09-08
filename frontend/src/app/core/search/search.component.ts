import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { VoiceCallService } from '../services/voice-call.service';

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

  /** Listener do resultado da busca retornada pelo backend */
  private searchSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private voiceCall: VoiceCallService) {
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
  }

  ngOnDestroy() {
    /* Remove o listeners de evento do backend quando o componente é removido da tela, para evitar memory leaks */
    this.searchSub.unsubscribe();
  }

  /** Evento disparado ao se clicar no botão 'Buscar' */
  onFormSubmit() {
    const userName = this.userSearch.get('name').value;
    this.searchResult = '';
    this.userService.getUser(userName);
  }

  startCall() {
    this.voiceCall.startCall(this.userSearch.get('name').value);
    this.callStarted = true;
  }

  endCall() {
    this.voiceCall.endCall();
    this.callStarted = false;
  }

}
