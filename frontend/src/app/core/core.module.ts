import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskModule } from 'ngx-mask';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { MainPageComponent } from './main-page/main-page.component';
import { SearchComponent } from './search/search.component';
import { CloseConnectionComponent } from './close-connection/close-connection.component';
import { ReceivingCallDialogComponent } from './receiving-call-dialog/receiving-call-dialog.component';
import { WaitingForCallDialogComponent } from './waiting-for-call-dialog/waiting-for-call-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material';

/** Configuração de comunicação com o backend
 * o impotante é ser mantida a porta 4444, numa situação de execução local, o endereço 127.0.0.1 será suficiente
 * para conectar. Como o desenvolvimento foi feito numa vm linux e ela tinha outra interface de rede, usamos o endereço da vm aqui para a conexão.
 */
const config: SocketIoConfig = { url: 'https://192.168.0.103:4444', options: {} };

@NgModule({
  declarations: [
    MainPageComponent,
    SearchComponent,
    CloseConnectionComponent,
    ReceivingCallDialogComponent,
    WaitingForCallDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgxMaskModule.forRoot(),
    SocketIoModule.forRoot(config),
    ReactiveFormsModule
  ],
  exports: [MainPageComponent],
  entryComponents: [
    CloseConnectionComponent,
    ReceivingCallDialogComponent,
    WaitingForCallDialogComponent
  ]
})
export class CoreModule { }
