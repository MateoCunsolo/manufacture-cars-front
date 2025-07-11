import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { Manufacturer } from '../models/cars.response';

export interface FilterCriteria {
  countryCode: string;
  vehicleType: string;
  searchTerm: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  private http = inject(HttpClient);
  private readonly url = 'https://manufacture-cars.onrender.com/cars-manufacturers';

  $cars = signal<Manufacturer[]>([]);
  $loading = signal(false);
  $error = signal<string | null>(null);
  
  $filterCriteria = signal<FilterCriteria>({
    countryCode: '',
    vehicleType: '',
    searchTerm: ''
  });

  $filteredCars = computed(() => {
    const cars = this.$cars();
    const filters = this.$filterCriteria();
    return cars.filter(car => {
      if (filters.countryCode && car.countryCode !== filters.countryCode) {
        return false;
      }

      if (filters.vehicleType && !car.vehicleTypes.some(type => 
        type.name.toLowerCase().includes(filters.vehicleType.toLowerCase())
      )) {
        return false;
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = car.commonName.toLowerCase().includes(searchLower);
        const matchesLegal = car.legalName.toLowerCase().includes(searchLower);
        const matchesCountry = car.country.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesLegal && !matchesCountry) {
          return false;
        }
      }
      return true;
    });
  });

  // Computed signal para países únicos
  $uniqueCountries = computed(() => {
    const cars = this.$cars();
    const countries = new Map<string, { code: string; name: string; flag: string }>();
    
    cars.forEach(car => {
      if (!countries.has(car.countryCode)) {
        countries.set(car.countryCode, {
          code: car.countryCode,
          name: car.country,
          flag: car.flagUrl
        });
      }
    });
    
    return Array.from(countries.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Computed signal para tipos de vehículos únicos
  $uniqueVehicleTypes = computed(() => {
    const cars = this.$cars();
    const types = new Set<string>();
    
    cars.forEach(car => {
      car.vehicleTypes.forEach(type => {
        types.add(type.name);
      });
    });
    
    return Array.from(types).sort();
  });


  $stats = computed(() => {
    const allCars = this.$cars();
    const filteredCars = this.$filteredCars();
    return {
      total: allCars.length,
      filtered: filteredCars.length,
      countries: this.$uniqueCountries().length,
      vehicleTypes: this.$uniqueVehicleTypes().length
    };
  });

  getManufacturers(): Observable<Manufacturer[]> {
    this.$loading.set(true);
    this.$error.set(null);
    return this.http.get<Manufacturer[]>(this.url).pipe(
      tap((res) => {
        this.$cars.set(res || []);
        this.$loading.set(false);
      }),
      catchError((error) => {
        this.$error.set(error.message || 'Error desconocido');
        this.$loading.set(false);
        return of([]);
      })
    );
  }

  updateFilter(criteria: Partial<FilterCriteria>) {
    const current = this.$filterCriteria();
    this.$filterCriteria.set({ ...current, ...criteria });
  }

  clearFilters() {
    this.$filterCriteria.set({
      countryCode: '',
      vehicleType: '',
      searchTerm: ''
    });
  }
  getManufacturersByCountry(countryCode: string): Manufacturer[] {
    return this.$cars().filter(car => car.countryCode === countryCode);
  }

  getManufacturersByVehicleType(vehicleType: string): Manufacturer[] {
    return this.$cars().filter(car => 
      car.vehicleTypes.some(type => 
        type.name.toLowerCase().includes(vehicleType.toLowerCase())
      )
    );
  }
}
