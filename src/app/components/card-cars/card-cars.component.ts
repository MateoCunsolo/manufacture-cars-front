import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manufacturer } from '../../models/cars.response';

@Component({
  selector: 'app-card-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-cars.component.html',
  styleUrl: './card-cars.component.scss'
})

export class CardCarsComponent {
  @Input() car!: Manufacturer;
  isOpen = false;

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
  }

  navigateToVehicleType(vehicleType: string): void {
    window.open('https://www.google.com/search?q=' + vehicleType + ' ' + this.car.commonName + ' ' + this.car.country + '&tbm=isch', '_blank');
  }
}
  