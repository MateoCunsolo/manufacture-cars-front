import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CarsService } from '../../services/cars.service';
import { CardCarsComponent } from '../card-cars/card-cars.component';
import { FilterCarsComponent } from '../filter-cars/filter-cars.component';

@Component({
  selector: 'app-list-cars',
  standalone: true,
  imports: [CardCarsComponent, FilterCarsComponent],
  templateUrl: './list-cars.component.html',
  styleUrl: './list-cars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListCarsComponent implements OnInit {
  private carsService = inject(CarsService);
  // Signals del servicio
  $cars = computed(() => this.carsService.$cars());
  $loading = computed(() => this.carsService.$loading());
  $error = computed(() => this.carsService.$error());
  $filteredCars = computed(() => this.carsService.$filteredCars());
  $uniqueCountries = computed(() => this.carsService.$uniqueCountries());
  $uniqueVehicleTypes = computed(() => this.carsService.$uniqueVehicleTypes());
  $stats = computed(() => this.carsService.$stats());
  showFilters = signal(false);

  hasActiveFilters(): boolean {
    const criteria = this.carsService.$filterCriteria();
    return !!(criteria.countryCode || criteria.vehicleType || criteria.searchTerm);
  }

  ngOnInit() {
    this.carsService.getManufacturers().subscribe();
  }

  clearAllFilters() {
    this.carsService.clearFilters();
  }

  retryFetch() {
    this.carsService.getManufacturers().subscribe();
  }

  toggleFilters() {
    this.showFilters.update(show => !show);
  }
}
