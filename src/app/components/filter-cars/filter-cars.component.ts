import { Component, computed, inject, signal } from '@angular/core';
import { CarsService } from '../../services/cars.service';

@Component({
  selector: 'app-filter-cars',
  imports: [],
  templateUrl: './filter-cars.component.html',
  styleUrl: './filter-cars.component.scss',
})
export class FilterCarsComponent {
  private carsService = inject(CarsService);
  $uniqueCountries = computed(() => this.carsService.$uniqueCountries());
  $uniqueVehicleTypes = computed(() => this.carsService.$uniqueVehicleTypes());
  $stats = computed(() => this.carsService.$stats());
  $searchTerm = signal('');

  
  filterByCountry(event: Event) {
    const target = event.target as HTMLSelectElement;
    const countryCode = target.value;
    this.carsService.updateFilter({ countryCode });
  }

  filterByVehicleType(event: Event) {
    const target = event.target as HTMLSelectElement;
    const vehicleType = target.value;
    this.carsService.updateFilter({ vehicleType });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    this.$searchTerm.set(searchTerm);
    this.carsService.updateFilter({ searchTerm });
  }

  clearAllFilters() {
    this.carsService.clearFilters();
    this.$searchTerm.set('');
  }

  // Métodos de utilidad
  hasActiveFilters(): boolean {
    const criteria = this.carsService.$filterCriteria();
    return !!(criteria.countryCode || criteria.vehicleType || criteria.searchTerm);
  }

  getFilterSummary(): string {
    const criteria = this.carsService.$filterCriteria();
    const filters = [];
    
    if (criteria.countryCode) {
      const country = this.$uniqueCountries().find(c => c.code === criteria.countryCode);
      filters.push(`País: ${country?.name || criteria.countryCode}`);
    }
    
    if (criteria.vehicleType) {
      filters.push(`Tipo: ${criteria.vehicleType}`);
    }
    
    if (criteria.searchTerm) {
      filters.push(`Búsqueda: "${criteria.searchTerm}"`);
    }
    
    return filters.join(', ');
  }
}
