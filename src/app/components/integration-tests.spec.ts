import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ListCarsComponent } from './list-cars/list-cars.component';
import { FilterCarsComponent } from './filter-cars/filter-cars.component';
import { CardCarsComponent } from './card-cars/card-cars.component';
import { CarsService } from '../services/cars.service';
import { Manufacturer } from '../models/cars.response';

describe('Integration Tests - Cars Application', () => {
  let listComponent: ListCarsComponent;
  let filterComponent: FilterCarsComponent;
  let listFixture: ComponentFixture<ListCarsComponent>;
  let filterFixture: ComponentFixture<FilterCarsComponent>;
  let carsService: CarsService;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListCarsComponent,
        FilterCarsComponent,
        CardCarsComponent
      ],
      providers: [
        CarsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    listFixture = TestBed.createComponent(ListCarsComponent);
    filterFixture = TestBed.createComponent(FilterCarsComponent);
    listComponent = listFixture.componentInstance;
    filterComponent = filterFixture.componentInstance;
    carsService = TestBed.inject(CarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  describe('Complete Flow Integration', () => {
    it('should load data and display in list component', () => {
      // Inicializar el componente de lista
      listComponent.ngOnInit();
      
      // Simular respuesta HTTP
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Verificar que los datos se cargaron correctamente
      expect(listComponent.$cars()).toEqual(mockCars);
      expect(listComponent.$loading()).toBe(false);
      expect(listComponent.$error()).toBeNull();
    });

    it('should filter cars and update list when filter is applied', () => {
      // Cargar datos iniciales
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Aplicar filtro por país
      filterComponent.filterByCountry({ target: { value: 'DE' } } as any);
      
      // Verificar que el filtro se aplicó
      expect(carsService.$filterCriteria().countryCode).toBe('DE');
      
      // Verificar que la lista filtrada se actualizó
      const filteredCars = listComponent.$filteredCars();
      expect(filteredCars.length).toBe(1);
      expect(filteredCars[0].commonName).toBe('BMW');
    });

    it('should clear filters and restore full list', () => {
      // Cargar datos iniciales
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Aplicar filtro
      filterComponent.filterByCountry({ target: { value: 'DE' } } as any);
      expect(listComponent.$filteredCars().length).toBe(1);
      
      // Limpiar filtros
      filterComponent.clearAllFilters();
      
      // Verificar que se restauró la lista completa
      expect(listComponent.$filteredCars().length).toBe(3);
      expect(carsService.$filterCriteria().countryCode).toBe('');
    });
  });

  describe('Component Communication', () => {
    it('should share service state between components', () => {
      // Inicializar ambos componentes
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Verificar que ambos componentes acceden al mismo estado del servicio
      expect(listComponent.$cars()).toBe(carsService.$cars());
      expect(listComponent.$loading()).toBe(carsService.$loading());
      expect(listComponent.$error()).toBe(carsService.$error());
    });

    it('should update both components when filter changes', () => {
      // Cargar datos
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Aplicar filtro desde el componente de filtros
      filterComponent.filterByVehicleType({ target: { value: 'Sedan' } } as any);
      
      // Verificar que ambos componentes reflejan el cambio
      expect(listComponent.$filteredCars().length).toBe(2);
      expect(carsService.$filteredCars().length).toBe(2);
    });

    it('should maintain filter state across component interactions', () => {
      // Cargar datos
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Aplicar múltiples filtros
      filterComponent.filterByCountry({ target: { value: 'DE' } } as any);
      filterComponent.filterByVehicleType({ target: { value: 'Sedan' } } as any);
      filterComponent.onSearchChange({ target: { value: 'BMW' } } as any);
      
      // Verificar que el estado se mantiene en ambos componentes
      const criteria = carsService.$filterCriteria();
      expect(criteria.countryCode).toBe('DE');
      expect(criteria.vehicleType).toBe('Sedan');
      expect(criteria.searchTerm).toBe('BMW');
      
      expect(listComponent.hasActiveFilters()).toBe(true);
      expect(filterComponent.hasActiveFilters()).toBe(true);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle HTTP errors and show error state in both components', () => {
      // Inicializar componente de lista
      listComponent.ngOnInit();
      
      // Simular error HTTP
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.error(new ErrorEvent('Http failure response for https://manufacture-cars.onrender.com/cars-manufacturers: 0'));
      
      // Verificar que ambos componentes muestran el error
      expect(listComponent.$error()?.trim()).toBe('Http failure response for https://manufacture-cars.onrender.com/cars-manufacturers: 0');
      expect(carsService.$error()?.trim()).toBe('Http failure response for https://manufacture-cars.onrender.com/cars-manufacturers: 0');
      expect(listComponent.$loading()).toBe(false); 
      expect(carsService.$loading()).toBe(false);
    });
    
    it('should allow retry from list component after error', () => {
      // Simular error inicial
      listComponent.ngOnInit();
      const req1 = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req1.error(new ErrorEvent('Http failure response for https://manufacture-cars.onrender.com/cars-manufacturers: 0'));
      
      // Intentar reintentar
      listComponent.retryFetch();
      const req2 = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req2.flush(mockCars);
      
      // Verificar que se recuperó correctamente
      expect(listComponent.$cars()).toEqual(mockCars);
      expect(listComponent.$error()).toBeNull();
    });
  });

  describe('UI State Integration', () => {
    it('should toggle filters visibility and maintain state', () => {
      // Verificar estado inicial
      expect(listComponent.showFilters()).toBe(false);
      
      // Alternar visibilidad
      listComponent.toggleFilters();
      expect(listComponent.showFilters()).toBe(true);
      
      // Verificar que el estado se mantiene
      listComponent.toggleFilters();
      expect(listComponent.showFilters()).toBe(false);
    });

    it('should update stats when filters are applied', () => {
      // Cargar datos
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Verificar stats iniciales
      let stats = listComponent.$stats();
      expect(stats.total).toBe(3);
      expect(stats.filtered).toBe(3);
      
      // Aplicar filtro
      filterComponent.filterByCountry({ target: { value: 'DE' } } as any);
      
      // Verificar que stats se actualizaron
      stats = listComponent.$stats();
      expect(stats.total).toBe(3);
      expect(stats.filtered).toBe(1);
    });
  });

  describe('Data Flow Integration', () => {
    it('should compute unique countries and vehicle types correctly', () => {
      // Cargar datos
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Verificar países únicos
      const countries = listComponent.$uniqueCountries();
      expect(countries.length).toBe(3);
      expect(countries.map(c => c.name)).toEqual(['Alemania', 'Italia', 'Japón']);
      
      // Verificar tipos de vehículos únicos
      const vehicleTypes = listComponent.$uniqueVehicleTypes();
      expect(vehicleTypes.length).toBe(5);
      expect(vehicleTypes).toContain('Sedan');
      expect(vehicleTypes).toContain('SUV');
      expect(vehicleTypes).toContain('Sports Car');
    });

    it('should filter by multiple criteria and maintain consistency', () => {
      // Cargar datos
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(mockCars);
      
      // Aplicar filtros múltiples
      filterComponent.filterByCountry({ target: { value: 'JP' } } as any);
      filterComponent.filterByVehicleType({ target: { value: 'Sedan' } } as any);
      
      // Verificar que solo Toyota queda (Japón + Sedan)
      const filteredCars = listComponent.$filteredCars();
      expect(filteredCars.length).toBe(1);
      expect(filteredCars[0].commonName).toBe('Toyota');
      
      // Verificar que los filtros están activos
      expect(listComponent.hasActiveFilters()).toBe(true);
      expect(filterComponent.hasActiveFilters()).toBe(true);
    });
  });

  describe('Performance Integration', () => {
    it('should handle large datasets efficiently', () => {
      // Crear dataset grande
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        country: `País ${i % 10}`,
        countryCode: `C${i % 10}`,
        flagUrl: `https://flagcdn.com/c${i % 10}.svg`,
        commonName: `Marca ${i}`,
        legalName: `Empresa Legal ${i}`,
        vehicleTypes: [{ name: `Tipo ${i % 5}` }]
      }));
      
      // Cargar datos grandes
      listComponent.ngOnInit();
      const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
      req.flush(largeDataset);
      
      // Verificar que se procesan correctamente
      expect(listComponent.$cars().length).toBe(100);
      expect(listComponent.$filteredCars().length).toBe(100);
      
      // Aplicar filtro y verificar rendimiento
      filterComponent.filterByCountry({ target: { value: 'C0' } } as any);
      expect(listComponent.$filteredCars().length).toBe(10); // 10 elementos con countryCode C0
    });
  });
}); 