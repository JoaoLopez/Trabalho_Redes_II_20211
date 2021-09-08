import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { CloseConnectionComponent } from '../close-connection/close-connection.component';
import { CloseConnection } from '../interfaces/close-dialog.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

/**
 * Tela principal da aplicação
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Formulário de inserção de dados de cadastro de usuário */
  user: FormGroup;
  /** Eventos que a aplicação recebe do servidor */
  events: string[] = [];

  /** Colunas exibidas na tabela de usuários */
  displayedColumns: string[] = ['name', 'ip', 'port'];
  /** Array com os dados exibidos na tabela de usuários */
  dataSource: User[] = [];

  /** Escuta o evento do WebSocket que emite os usuários cadastrados no sistema */
  users: Observable<User[]>;
  /** Usuário atual da sessão (que informou seus campos no formulário e se cadastrou) */
  currentUser: User = null;
  /** Indica se existe um usuário na sessão atual */
  hasUser = false;
  /** Número de mensagens de eventos emitidas pelo backend que ainda não foram lidas */
  eventsCount = 0;

  /* Listeners de eventos emitidos pelo backend */
  /** Usuário cadastrado */
  private userSub: Subscription;
  /** Eventos genéricos que são exibidos na aba 'Eventos' */
  private eventsSub: Subscription;
  /** Erros */
  private errorsSub: Subscription;
  /** Remoção de usuário e encerramento de sessão/conexão */
  private removeSub: Subscription;
  private voiceReceived: Subscription;

  /** Referência ao componente de abas */
  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    /* Inicia o formulário de usuário com valores padrão */
    this.user = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      ip: ['', Validators.compose([Validators.required])],
      port: ['', Validators.required]
    });
  }

  ngOnInit() {
    /* Inicialização dos listeners de eventos de comunicação com o backend e implementação das respectivas respostas do sistema à cada evento */
    this.users = this.userService.users;
    this.userSub = this.userService.currentUser.subscribe(user => {
      console.log(user);
      this.currentUser = user;
      this.hasUser = true;
      this.user.disable();
    });
    this.eventsSub = this.userService.events.subscribe(event => {
      console.log(event);
      this.eventsCount++;
      this.events.push(event);
    });
    this.errorsSub = this.userService.errors.subscribe(error => {
      console.log(error);
      this.snackBar.open(error, 'Fechar', {
        duration: 2000,
      });
    });
    this.removeSub = this.userService.remove.subscribe(userName => {
      console.log(userName);
      this.tabGroup.selectedIndex = 0;
      this.currentUser = null;
      this.hasUser = false;
      this.user.reset();
      this.user.enable();
    })
    this.users.subscribe(users => {
      console.log(users)
      const newDataSource = users.slice();
      this.dataSource = [...newDataSource];
    });
    this.voiceReceived = this.userService.voiceReceived.subscribe(voice => {
      let audio = new Audio(voice);
      audio.play();
    });
  }

  ngAfterViewInit() {
    /* Detecta se a aba 'Eventos' foi selecionada para zerar o contador de eventos não lidos */
    this.tabGroup.selectedIndexChange.subscribe(tab => {
      if (tab === 2) {
        this.eventsCount = 0;
      }
    });
  }

  ngOnDestroy() {
    /* Remove os listeners de eventos do backend quando o componente é removido da tela, para evitar memory leaks */
    this.userSub.unsubscribe();
    this.eventsSub.unsubscribe();
    this.errorsSub.unsubscribe();
    this.removeSub.unsubscribe();
    this.voiceReceived.unsubscribe();
  }

  /** Evento disparado ao se clicar no botão 'Conectar' na aba 'Cadastro' */
  onFormSubmit() {
    const newUser = this.user.value;
    newUser.port = new Number(newUser.port);
    this.userService.newUser(this.user.value);
  }

  /** Abre o dialog de confirmação de encerramento de conexão e caso a resposta seja positiva para o fechamento,
   * envia uma mensagem de encerramento/remoção do usuário para o servidor */
  openDialog() {
    const dialogRef = this.dialog.open(CloseConnectionComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result: CloseConnection) => {
      if (result.close) {
        this.userService.removeUser(this.currentUser.name);
      }
    });
  }
}
