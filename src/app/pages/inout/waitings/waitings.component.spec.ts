import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingsComponent } from './list.component';

describe('ListComponent', () => {
  let component: WaitingsComponent;
  let fixture: ComponentFixture<WaitingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingsComponent]
    });
    fixture = TestBed.createComponent(WaitingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
