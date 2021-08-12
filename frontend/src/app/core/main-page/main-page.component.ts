import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { CloseConnectionComponent } from '../close-connection/close-connection.component';
import { CloseConnection } from '../interfaces/close-dialog.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit, OnDestroy {

  user: FormGroup;
  events: string[] = [];

  displayedColumns: string[] = ['name', 'ip', 'port'];
  dataSource: User[] = [];

  users: Observable<User[]>;
  currentUser: User = null;
  hasUser = false;
  eventsCount = 0;

  private userSub: Subscription;
  private eventsSub: Subscription;
  private errorsSub: Subscription;
  private removeSub: Subscription;

  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.user = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      ip: ['', Validators.compose([Validators.required])],
      port: ['', Validators.required]
    });
  }

  ngOnInit() {
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
  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndexChange.subscribe(tab => {
      if (tab === 2) {
        this.eventsCount = 0;
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.eventsSub.unsubscribe();
    this.errorsSub.unsubscribe();
    this.removeSub.unsubscribe();
  }

  onFormSubmit() {
    const newUser = this.user.value;
    newUser.port = new Number(newUser.port);
    this.userService.newUser(this.user.value);
  }

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
