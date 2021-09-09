import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingCallDialogComponent } from './receiving-call-dialog.component';

describe('ReceivingCallDialogComponent', () => {
  let component: ReceivingCallDialogComponent;
  let fixture: ComponentFixture<ReceivingCallDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivingCallDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
