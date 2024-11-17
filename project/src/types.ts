export interface Supply {
  days: number;
  price: number;
  available: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  distance: number;
  hasDelivery: boolean;
  logo: string;
  supplyOptions: Supply[];
}

export interface CartItem {
  medicationId: string;
  pharmacyId: string;
  supplyDays: number;
  price: number;
}