import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  userSearch: FormGroup;
  searchResult = '';

  private searchSub: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userSearch = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
    });
  }

  ngOnInit() {
    this.searchSub = this.userService.searchUser.subscribe(searchResult => {
      console.log(searchResult);
      this.searchResult = searchResult;
    });
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  onFormSubmit() {
    const userName = this.userSearch.get('name').value;
    this.userService.getUser(userName);
  }

}
