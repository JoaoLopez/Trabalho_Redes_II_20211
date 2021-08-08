import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  user: FormGroup;
  events = 'Eventos';

  displayedColumns: string[] = ['name', 'ip', 'port'];
  dataSource: User[] = [];

  users: Observable<User[]>;
  currentUser: User;
  private userSub: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.user = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      ip: ['', Validators.compose([Validators.required, Validators.pattern(new RegExp('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}', 'g'))])],
      port: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.users = this.userService.users;
    this.userSub = this.userService.currentUser.subscribe(user => {
      console.log(user);
      this.currentUser = user;
    });
    this.users.subscribe(users => {
      console.log(users)
      const newDataSource = this.dataSource.slice();
      newDataSource.push(this.user.value);
      this.dataSource = [...newDataSource];
      this.user.reset();
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onFormSubmit() {
    const newUser = this.user.value;
    newUser.port = new Number(newUser.port);
    this.userService.newUser(this.user.value);
  }
}
