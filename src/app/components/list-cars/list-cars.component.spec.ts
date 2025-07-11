import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCarsComponent } from './list-cars.component';
import { CarsService } from '../../services/cars.service';
import { Manufacturer } from '../../models/cars.response';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ListCarsComponent', () => {
  let component: ListCarsComponent;
  let fixture: ComponentFixture<ListCarsComponent>;
  let service: jest.Mocked<CarsService>;

  const mockCars: Manufacturer[] = [
    {
      country: 'Alemania',
      countryCode: 'DE',
      flagUrl: 'https://flagcdn.com/de.svg',
      commonName: 'BMW',
      legalName: 'Bayerische Motoren Werke AG',
      vehicleTypes: [{ name: 'Sedan' }, { name: 'SUV' }]
    },
    {
      country: 'Italia',
      countryCode: 'IT',
      flagUrl: 'https://flagcdn.com/it.svg',
      commonName: 'Ferrari',
      legalName: 'Ferrari N.V.',
      vehicleTypes: [{ name: 'Sports Car' }, { name: 'Coupe' }]
    }
  ];

  const mockFilterCriteria = {
    countryCode: '',
    vehicleType: '',
    searchTerm: ''
  };

  const mockStats = {
    total: 2,
    filtered: 2,
    countries: 2,
    vehicleTypes: 4
  };

  const mockCountries = [
    { code: 'DE', name: 'Alemania', flag: 'https://flagcdn.com/de.svg' },
    { code: 'IT', name: 'Italia', flag: 'https://flagcdn.com/it.svg' }
  ];

  const mockVehicleTypes = ['Coupe', 'Sedan', 'Sports Car', 'SUV'];

  beforeEach(async () => {
    const carsServiceMock = {
      getManufacturers: jest.fn().mockReturnValue(of(mockCars)),
      clearFilters: jest.fn(),
      $cars: signal(mockCars),
      $filteredCars: signal(mockCars),
      $loading: signal(false),
      $error: signal(null),
      $uniqueCountries: signal(mockCountries),
      $uniqueVehicleTypes: signal(mockVehicleTypes),
      $stats: signal(mockStats),
      $filterCriteria: signal(mockFilterCriteria),
      updateFilter: jest.fn(),
      clearAllFilters: jest.fn(),
      hasActiveFilters: jest.fn(),
      getManufacturersByCountry: jest.fn(),
      getManufacturersByVehicleType: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ListCarsComponent],
      providers: [
        { provide: CarsService, useValue: carsServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCarsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CarsService) as jest.Mocked<CarsService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.showFilters()).toBe(false);
    });

    it('should call getManufacturers on ngOnInit', () => {
      component.ngOnInit();
      
      expect(service.getManufacturers).toHaveBeenCalled();
    });

    it('should subscribe to getManufacturers observable', () => {
      component.ngOnInit();
      
      expect(service.getManufacturers).toHaveBeenCalledTimes(1);
    });
  });

  describe('Signals and Computed Values', () => {
    it('should have access to cars signal', () => {
      expect(component.$cars()).toEqual(mockCars);
    });

    it('should have access to loading signal', () => {
      expect(component.$loading()).toBe(false);
    });

    it('should have access to error signal', () => {
      expect(component.$error()).toBeNull();
    });

    it('should have access to filtered cars signal', () => {
      expect(component.$filteredCars()).toEqual(mockCars);
    });

    it('should have access to unique countries signal', () => {
      const countries = component.$uniqueCountries();
      expect(countries.length).toBe(2);
      expect(countries[0].name).toBe('Alemania');
      expect(countries[1].name).toBe('Italia');
    });

    it('should have access to unique vehicle types signal', () => {
      const types = component.$uniqueVehicleTypes();
      expect(types.length).toBe(4);
      expect(types).toContain('Sedan');
      expect(types).toContain('SUV');
    });

    it('should have access to stats signal', () => {
      const stats = component.$stats();
      expect(stats.total).toBe(2);
      expect(stats.filtered).toBe(2);
      expect(stats.countries).toBe(2);
      expect(stats.vehicleTypes).toBe(4);
    });
  });

  describe('Filter Management', () => {
    it('should detect active filters when filters are applied', () => {
      (service.$filterCriteria as any) = signal({ 
        countryCode: 'DE', 
        vehicleType: '', 
        searchTerm: '' 
      });
      
      const hasFilters = component.hasActiveFilters();
      
      expect(hasFilters).toBe(true);
    });

    it('should detect no active filters when filters are empty', () => {
      (service.$filterCriteria as any) = signal({ 
        countryCode: '', 
        vehicleType: '', 
        searchTerm: '' 
      });
      
      const hasFilters = component.hasActiveFilters();
      
      expect(hasFilters).toBe(false);
    });

    it('should clear all filters', () => {
      component.clearAllFilters();
      
      expect(service.clearFilters).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should retry fetch when retryFetch is called', () => {
      component.retryFetch();
      
      expect(service.getManufacturers).toHaveBeenCalled();
    });

    it('should handle retry after error', () => {
      // Reset mock calls
      jest.clearAllMocks();
      
      component.retryFetch();
      
      expect(service.getManufacturers).toHaveBeenCalledTimes(1);
    });
  });

  describe('UI State Management', () => {
    it('should toggle filters visibility', () => {
      expect(component.showFilters()).toBe(false);
      
      component.toggleFilters();
      expect(component.showFilters()).toBe(true);
      
      component.toggleFilters();
      expect(component.showFilters()).toBe(false);
    });

    it('should maintain filters state correctly', () => {
      component.toggleFilters();
      expect(component.showFilters()).toBe(true);
      
      component.toggleFilters();
      expect(component.showFilters()).toBe(false);
      
      component.toggleFilters();
      expect(component.showFilters()).toBe(true);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize properly', () => {
      expect(component).toBeDefined();
      expect(component.showFilters).toBeDefined();
      expect(component.$cars).toBeDefined();
      expect(component.$loading).toBeDefined();
      expect(component.$error).toBeDefined();
    });

    it('should have all required methods', () => {
      expect(typeof component.hasActiveFilters).toBe('function');
      expect(typeof component.clearAllFilters).toBe('function');
      expect(typeof component.retryFetch).toBe('function');
      expect(typeof component.toggleFilters).toBe('function');
      expect(typeof component.ngOnInit).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty cars array', () => {
      (service.$cars as any) = signal([]);
      
      expect(component.$cars()).toEqual([]);
    });

    it('should handle loading state', () => {
      (service.$loading as any) = signal(true);
      
      expect(component.$loading()).toBe(true);
    });

    it('should handle error state', () => {
      const errorMessage = 'Error de conexión';
      (service.$error as any) = signal(errorMessage);
      
      expect(component.$error()).toBe(errorMessage);
    });

    it('should handle multiple retry attempts', () => {
      jest.clearAllMocks();
      
      component.retryFetch();
      component.retryFetch();
      component.retryFetch();
      
      expect(service.getManufacturers).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration with Service', () => {
    it('should use service signals correctly', () => {
      expect(component.$cars()).toBe(service.$cars());
      expect(component.$loading()).toBe(service.$loading());
      expect(component.$error()).toBe(service.$error());
      expect(component.$filteredCars()).toBe(service.$filteredCars());
    });

    it('should call service methods correctly', () => {
      component.clearAllFilters();
      expect(service.clearFilters).toHaveBeenCalled();
      
      component.retryFetch();
      expect(service.getManufacturers).toHaveBeenCalled();
    });
  });
});
