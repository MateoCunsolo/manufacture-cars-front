import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarsComponent } from './list-cars.component';
import { CarsService } from '../../services/cars.service';

describe('ListCarsComponent', () => {
  let component: ListCarsComponent;
  let fixture: ComponentFixture<ListCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener los datos de los autos', () => {
    const carsService = TestBed.inject(CarsService);
    const spy = spyOn(carsService, 'getManufacturers').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.$cars()).toBeDefined();
    expect(component.$cars().length).toBeGreaterThan(0);
  })


});
