import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterCarsComponent } from './filter-cars.component';
import { CarsService } from '../../services/cars.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('FilterCarsComponent', () => {
  let component: FilterCarsComponent;
  let fixture: ComponentFixture<FilterCarsComponent>;
  let service: jest.Mocked<CarsService>;

  const mockCountries = [
    { code: 'DE', name: 'Alemania', flag: 'https://flagcdn.com/de.svg' },
    { code: 'IT', name: 'Italia', flag: 'https://flagcdn.com/it.svg' }
  ];

  const mockVehicleTypes = ['Sedan', 'SUV', 'Sports Car'];

  beforeEach(async () => {
    const carsServiceMock = {
      updateFilter: jest.fn(),
      clearAllFilters: jest.fn(),
      $uniqueCountries: signal(mockCountries),
      $uniqueVehicleTypes: signal(mockVehicleTypes),
      $filterCriteria: signal({
        countryCode: '',
        vehicleType: '',
        searchTerm: ''
      }),
      hasActiveFilters: jest.fn(),
      getManufacturers: jest.fn(),
      clearFilters: jest.fn(),
      $cars: signal([]),
      $filteredCars: signal([]),  
      $loading: signal(false),
      $error: signal(null),
      $stats: signal({ total: 0, filtered: 0, countries: 2, vehicleTypes: 3 }),
      getManufacturersByCountry: jest.fn(),
      getManufacturersByVehicleType: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FilterCarsComponent],
      providers: [
        { provide: CarsService, useValue: carsServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterCarsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CarsService) as jest.Mocked<CarsService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('should have access to service signals', () => {
    expect(component.$uniqueCountries()).toEqual(mockCountries);
  });

  it('should call updateFilter when country filter changes', () => {
    const mockEvent = { target: { value: 'DE' } } as any;
    component.filterByCountry(mockEvent);
    expect(service.updateFilter).toHaveBeenCalledWith({ countryCode: 'DE' });
  });

  it('should call updateFilter when vehicle type filter changes', () => {
    const mockEvent = { target: { value: 'Sedan' } } as any;
    component.filterByVehicleType(mockEvent);
    expect(service.updateFilter).toHaveBeenCalledWith({ vehicleType: 'Sedan' });
  });

  it('should call clearFilters when clear button is clicked', () => {
    component.clearAllFilters();
    expect(service.clearFilters).toHaveBeenCalled();
  });
});
