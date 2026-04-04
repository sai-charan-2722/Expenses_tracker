import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancesTabComponent } from './balances-tab.component';

describe('BalancesTabComponent', () => {
  let component: BalancesTabComponent;
  let fixture: ComponentFixture<BalancesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalancesTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BalancesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
