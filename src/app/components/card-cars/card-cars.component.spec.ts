import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardCarsComponent } from './card-cars.component';
import { Manufacturer } from '../../models/cars.response';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CardCarsComponent', () => {
  let component: CardCarsComponent;
  let fixture: ComponentFixture<CardCarsComponent>;

  const mockCar: Manufacturer = {
    country: 'Alemania',
    countryCode: 'DE',
    flagUrl: 'https://flagcdn.com/de.svg',
    commonName: 'BMW',
    legalName: 'Bayerische Motoren Werke AG',
    vehicleTypes: [
      { name: 'Sedan' },
      { name: 'SUV' },
      { name: 'Coupe' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCarsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardCarsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should receive car input correctly', () => {
      component.car = mockCar;
      fixture.detectChanges();
      
      expect(component.car).toEqual(mockCar);
    });
  });

  describe('Modal Functionality', () => {
    it('should initialize with modal closed', () => {
      expect(component.isOpen).toBe(false);
    });

    it('should open modal when openModal is called', () => {
      component.openModal();
      expect(component.isOpen).toBe(true);
    });

    it('should close modal when closeModal is called', () => {
      component.isOpen = true;
      component.closeModal();
      expect(component.isOpen).toBe(false);
    });

    it('should toggle modal state correctly', () => {
      expect(component.isOpen).toBe(false);
      
      component.openModal();
      expect(component.isOpen).toBe(true);
      
      component.closeModal();
      expect(component.isOpen).toBe(false);
    });
  });

  describe('Navigation Functionality', () => {
    it('should open Google search in new tab for vehicle type', () => {
      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });
      
      component.car = mockCar;
      component.navigateToVehicleType('Sedan');
      
      const expectedUrl = 'https://www.google.com/search?q=Sedan BMW Alemania&tbm=isch';
      expect(mockOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
    });

    it('should handle different vehicle types correctly', () => {
      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });
      
      component.car = mockCar;
      component.navigateToVehicleType('SUV');
      
      const expectedUrl = 'https://www.google.com/search?q=SUV BMW Alemania&tbm=isch';
      expect(mockOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
  });

  describe('Edge Cases', () => {
    it('should handle car with empty vehicle types', () => {
      const carWithNoTypes = { ...mockCar, vehicleTypes: [] };
      component.car = carWithNoTypes;
      
      expect(() => component.navigateToVehicleType('Sedan')).not.toThrow();
    });

    it('should handle car with special characters in name', () => {
      const carWithSpecialChars = { ...mockCar, commonName: 'BMW & Co.' };
      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });
      
      component.car = carWithSpecialChars;
      component.navigateToVehicleType('Sedan');
      
      const expectedUrl = 'https://www.google.com/search?q=Sedan BMW & Co. Alemania&tbm=isch';
      expect(mockOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
  });
});
