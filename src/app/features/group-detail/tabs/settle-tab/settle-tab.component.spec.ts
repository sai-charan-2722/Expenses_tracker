import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleTabComponent } from './settle-tab.component';

describe('SettleTabComponent', () => {
  let component: SettleTabComponent;
  let fixture: ComponentFixture<SettleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettleTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
