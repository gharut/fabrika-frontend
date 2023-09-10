import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationSheetDialogComponent } from './calculation-sheet-dialog.component';

describe('CalculationSheetDialogComponent', () => {
  let component: CalculationSheetDialogComponent;
  let fixture: ComponentFixture<CalculationSheetDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationSheetDialogComponent]
    });
    fixture = TestBed.createComponent(CalculationSheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
