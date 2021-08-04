import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  user: FormGroup;
  events = 'Eventos';

  displayedColumns: string[] = ['name', 'ip', 'port'];
  dataSource: User[] = [];

  constructor(private fb: FormBuilder) {
    this.user = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      ip: ['', Validators.compose([Validators.required, Validators.pattern(new RegExp('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}', 'g'))])],
      port: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  onFormSubmit() {
    const newDataSource = this.dataSource.slice();
    newDataSource.push(this.user.value);
    this.dataSource = [...newDataSource];
    this.user.reset();
  }
}
