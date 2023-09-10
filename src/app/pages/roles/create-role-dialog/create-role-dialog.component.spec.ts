import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleDialogComponent } from './create-role-dialog.component';

describe('CreateRoleDialogComponent', () => {
  let component: CreateRoleDialogComponent;
  let fixture: ComponentFixture<CreateRoleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRoleDialogComponent]
    });
    fixture = TestBed.createComponent(CreateRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
