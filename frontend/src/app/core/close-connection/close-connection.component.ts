import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CloseConnection } from '../interfaces/close-dialog.interface';

/**
 * Componente de dialog que exibe a pergunta ao usuário se o mesmo deseja encerrar sua conexão
 */
@Component({
  selector: 'app-close-connection',
  templateUrl: './close-connection.component.html',
  styleUrls: ['./close-connection.component.scss']
})
export class CloseConnectionComponent implements OnInit {

  closeConnection: CloseConnection = { close: false };

  constructor(public dialogRef: MatDialogRef<CloseConnectionComponent>,) { }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(this.closeConnection);
  }

  onYesClick() {
    this.closeConnection.close = true;
    this.dialogRef.close(this.closeConnection);
  }
}
