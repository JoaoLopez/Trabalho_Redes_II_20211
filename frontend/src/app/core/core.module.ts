import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskModule } from 'ngx-mask';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { MainPageComponent } from './main-page/main-page.component';
import { SearchComponent } from './search/search.component';

const config: SocketIoConfig = { url: 'http://172.24.12.45:4444', options: {} };

@NgModule({
  declarations: [MainPageComponent, SearchComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxMaskModule.forRoot(),
    SocketIoModule.forRoot(config),
    ReactiveFormsModule
  ],
  exports: [MainPageComponent]
})
export class CoreModule { }
