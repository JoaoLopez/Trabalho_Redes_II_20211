import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForCallDialogComponent } from './waiting-for-call-dialog.component';

describe('WaitingForCallDialogComponent', () => {
  let component: WaitingForCallDialogComponent;
  let fixture: ComponentFixture<WaitingForCallDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingForCallDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingForCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
