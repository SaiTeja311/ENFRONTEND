export interface Pharmacy {
  id: string;
  name: string;
  distance: number;
  supplyOptions: Supply[];
  hasDelivery: boolean;
  logo: string;
}

export interface Supply {
  days: number;
  price: number;
  available: boolean;
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  alternatives?: string[];
  image?: string;
}

export interface CartItem {
  medicationId: string;
  pharmacyId: string;
  supplyDays: number;
  price: number;
}