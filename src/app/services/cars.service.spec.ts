import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CarsService } from './cars.service';
import { Manufacturer } from '../models/cars.response';

describe('CarsService', () => {
  let service: CarsService;
  let httpMock: HttpTestingController;

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
    },
    {
      country: 'Japón',
      countryCode: 'JP',
      flagUrl: 'https://flagcdn.com/jp.svg',
      commonName: 'Toyota',
      legalName: 'Toyota Motor Corporation',
      vehicleTypes: [{ name: 'Sedan' }, { name: 'SUV' }, { name: 'Hatchback' }]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty cars array', () => {
      expect(service.$cars()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(service.$loading()).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(service.$error()).toBeNull();
    });

    it('should initialize with empty filter criteria', () => {
      const criteria = service.$filterCriteria();
      expect(criteria.countryCode).toBe('');
      expect(criteria.vehicleType).toBe('');
      expect(criteria.searchTerm).toBe('');
    });
  });

  describe('HTTP Operations', () => {
    it('should fetch manufacturers successfully', () => {
      service.getManufacturers().subscribe(cars => {
        expect(cars).toEqual(mockCars);
      });

      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      expect(req.request.method).toBe('GET');
      req.flush(mockCars);
    });

    it('should set loading state during request', () => {
      service.getManufacturers().subscribe();
      
      expect(service.$loading()).toBe(true);
      
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      expect(service.$loading()).toBe(false);
    });

    it('should handle HTTP error', () => {
      const errorMessage = 'Error de conexión';
      service.getManufacturers().subscribe(cars => {
        expect(cars).toEqual([]);
      });
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.error(new ErrorEvent('Http failure response for https://manufacture-cars.onrender.com/cars-manufacturers: 0'));
      expect(service.$error()?.trim()).toBe('Http failure response for https://manufacture-cars.onrender.com/cars-manufacturers: 0');
      expect(service.$loading()).toBe(false);
    });

    it('should handle empty response', () => {
      service.getManufacturers().subscribe(cars => {
        expect(cars).toEqual([]);
      });

      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(null);
      
      expect(service.$cars()).toEqual([]);
    });
  });

  describe('Filtering Logic', () => {
    beforeEach(() => {
      service.$cars.set(mockCars);
    });

    it('should filter by country code', () => {
      service.updateFilter({ countryCode: 'DE' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(1);
      expect(filtered[0].commonName).toBe('BMW');
    });

    it('should filter by vehicle type', () => {
      service.updateFilter({ vehicleType: 'Sedan' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(2);
      expect(filtered.some(car => car.commonName === 'BMW')).toBe(true);
      expect(filtered.some(car => car.commonName === 'Toyota')).toBe(true);
    });

    it('should filter by search term in common name', () => {
      service.updateFilter({ searchTerm: 'BMW' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(1);
      expect(filtered[0].commonName).toBe('BMW');
    });

    it('should filter by search term in legal name', () => {
      service.updateFilter({ searchTerm: 'Bayerische' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(1);
      expect(filtered[0].legalName).toBe('Bayerische Motoren Werke AG');
    });

    it('should filter by search term in country', () => {
      service.updateFilter({ searchTerm: 'Alemania' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(1);
      expect(filtered[0].country).toBe('Alemania');
    });

    it('should apply multiple filters', () => {
      service.updateFilter({ 
        countryCode: 'DE', 
        vehicleType: 'Sedan',
        searchTerm: 'BMW'
      });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(1);
      expect(filtered[0].commonName).toBe('BMW');
    });

    it('should return empty array when no matches', () => {
      service.updateFilter({ searchTerm: 'NonExistent' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(0);
    });

    it('should be case insensitive for search terms', () => {
      service.updateFilter({ searchTerm: 'bmw' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(1);
      expect(filtered[0].commonName).toBe('BMW');
    });

    it('should be case insensitive for vehicle types', () => {
      service.updateFilter({ vehicleType: 'sedan' });
      
      const filtered = service.$filteredCars();
      expect(filtered.length).toBe(2);
    });
  });

  describe('Computed Signals', () => {
    beforeEach(() => {
      service.$cars.set(mockCars);
    });

    it('should compute unique countries correctly', () => {
      const countries = service.$uniqueCountries();
      expect(countries.length).toBe(3);
      expect(countries.map(c => c.name)).toEqual(['Alemania', 'Italia', 'Japón']);
    });

    it('should compute unique vehicle types correctly', () => {
      const types = service.$uniqueVehicleTypes();
      expect(types.length).toBe(5);
      expect(types).toContain('Sedan');
      expect(types).toContain('SUV');
      expect(types).toContain('Sports Car');
      expect(types).toContain('Coupe');
      expect(types).toContain('Hatchback');
    });

    it('should compute stats correctly', () => {
      const stats = service.$stats();
      expect(stats.total).toBe(3);
      expect(stats.filtered).toBe(3);
      expect(stats.countries).toBe(3);
      expect(stats.vehicleTypes).toBe(5);
    });

    it('should update stats when filters are applied', () => {
      service.updateFilter({ countryCode: 'DE' });
      
      const stats = service.$stats();
      expect(stats.total).toBe(3);
      expect(stats.filtered).toBe(1);
      expect(stats.countries).toBe(3);
      expect(stats.vehicleTypes).toBe(5);
    });
  });

  describe('Filter Management', () => {
    it('should update filter criteria', () => {
      service.updateFilter({ countryCode: 'DE' });
      
      const criteria = service.$filterCriteria();
      expect(criteria.countryCode).toBe('DE');
      expect(criteria.vehicleType).toBe('');
      expect(criteria.searchTerm).toBe('');
    });

    it('should merge filter criteria', () => {
      service.updateFilter({ countryCode: 'DE' });
      service.updateFilter({ vehicleType: 'Sedan' });
      
      const criteria = service.$filterCriteria();
      expect(criteria.countryCode).toBe('DE');
      expect(criteria.vehicleType).toBe('Sedan');
      expect(criteria.searchTerm).toBe('');
    });

    it('should clear all filters', () => {
      service.updateFilter({ 
        countryCode: 'DE', 
        vehicleType: 'Sedan',
        searchTerm: 'BMW'
      });
      
      service.clearFilters();
      
      const criteria = service.$filterCriteria();
      expect(criteria.countryCode).toBe('');
      expect(criteria.vehicleType).toBe('');
      expect(criteria.searchTerm).toBe('');
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      service.$cars.set(mockCars);
    });

    it('should get manufacturers by country', () => {
      const germanCars = service.getManufacturersByCountry('DE');
      expect(germanCars.length).toBe(1);
      expect(germanCars[0].commonName).toBe('BMW'); 
    });

    it('should get manufacturers by vehicle type', () => {
      const sedanCars = service.getManufacturersByVehicleType('Sedan');
      expect(sedanCars.length).toBe(2);
      expect(sedanCars.some(car => car.commonName === 'BMW')).toBe(true);
      expect(sedanCars.some(car => car.commonName === 'Toyota')).toBe(true);
    });

    it('should return empty array for non-existent country', () => {
      const cars = service.getManufacturersByCountry('XX');
      expect(cars.length).toBe(0);
    });

    it('should return empty array for non-existent vehicle type', () => {
      const cars = service.getManufacturersByVehicleType('NonExistent');
      expect(cars.length).toBe(0);
    });
  });
  
}); 