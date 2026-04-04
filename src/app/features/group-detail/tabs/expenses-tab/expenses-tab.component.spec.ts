import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesTabComponent } from './expenses-tab.component';

describe('ExpensesTabComponent', () => {
  let component: ExpensesTabComponent;
  let fixture: ComponentFixture<ExpensesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
