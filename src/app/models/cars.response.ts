export interface VehicleType {
  name: string;
}

export interface Manufacturer {
  country: string;
  countryCode: string;
  flagUrl: string;
  commonName: string;
  legalName: string;
  vehicleTypes: VehicleType[];
}
