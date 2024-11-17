
import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import type { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (item: CartItem) => void;
  onCheckout: () => void;
  searchedMedication: string; // Add searchedMedication prop
}

export function Cart({ items, onRemove, onCheckout, searchedMedication }: CartProps) {
  if (!items.length) return null;

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 backdrop-blur-sm bg-white/90">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
        </div>
        {searchedMedication && ( // Display the searched medication heading
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {searchedMedication}
            </h3>
          </div>
        )}
        <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
          {items.map((item) => (
            <div
              key={`${item.medicationId}-${item.pharmacyId}-${item.supplyDays}`}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-800">{item.medicationId}</p>
                <p className="text-sm text-gray-600">
                  {item.supplyDays}-day supply
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-green-600">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onRemove(item)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4 pt-3 border-t">
          <span className="font-semibold text-gray-800">Total:</span>
          <span className="font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full button-primary py-3"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
