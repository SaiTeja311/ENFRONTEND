import React from 'react';
import { MapPin, Truck, Clock } from 'lucide-react';
import type { Pharmacy, Supply } from '../types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onAddToCart: (supply: Supply) => void;
  medicineName: string; // New prop
}

export function PharmacyCard({ pharmacy, onAddToCart, medicineName }: PharmacyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="h-48 md:h-full relative">
            <img
              src={pharmacy.logo}
              alt={pharmacy.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
        <div className="p-6 md:w-2/3">
          <div className="flex flex-col justify-between items-start mb-4">
            {/* Display the searched medication name above the pharmacy name */}
            {medicineName && (
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {medicineName}
              </h2>
            )}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{pharmacy.name}</h3>

            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{pharmacy.distance.toFixed(1)} miles away</span>
            </div>
            {pharmacy.hasDelivery && (
              <div className="flex items-center gap-2 text-green-600">
                <Truck className="w-4 h-4" />
                <span>Home delivery available</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {pharmacy.supplyOptions.map((supply) => (
              <div
                key={supply.days}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span className="font-semibold text-gray-800">
                    {supply.days}-day supply
                  </span>
                  <p className="text-green-600 font-medium">
                    ${supply.price.toFixed(2)}
                  </p>
                </div>
                {pharmacy.hasDelivery && supply.available && (
                  <button
                    onClick={() => onAddToCart(supply)}
                    className="button-primary"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
