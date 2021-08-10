import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseConnectionComponent } from './close-connection.component';

describe('CloseConnectionComponent', () => {
  let component: CloseConnectionComponent;
  let fixture: ComponentFixture<CloseConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
