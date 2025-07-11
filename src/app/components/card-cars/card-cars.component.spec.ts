import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCarsComponent } from './card-cars.component';

describe('CardCarsComponent', () => {
  let component: CardCarsComponent;
  let fixture: ComponentFixture<CardCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
