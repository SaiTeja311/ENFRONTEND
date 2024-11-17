
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { PharmacyCard } from '../components/PharmacyCard';
import { AlternativeMeds } from '../components/AlternativeMeds';
import { Cart } from '../components/Cart';
import { useCart } from '../context/CartContext';
import { searchMedications, getPharmacies } from '../services/api';
import type { Pharmacy, Supply, CartItem } from '../types';
import { Pill } from 'lucide-react';
import toast from 'react-hot-toast';

export function HomePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMedicationName, setSearchedMedicationName] = useState(''); // For cart heading
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setSearchQuery(query);
      setSearchedMedicationName(query); // Set the medication name for the cart
      const medicationResponse = await searchMedications(query);
      const pharmaciesResponse = await getPharmacies(medicationResponse.data.medications[0].id);
      
      setPharmacies(pharmaciesResponse.data.pharmacies);
      setAlternatives(medicationResponse.data.medications[0].alternatives || []);
    } catch (error) {
      toast.error('Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (pharmacyId: string, supply: Supply) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        medicationId: searchQuery,
        pharmacyId,
        supplyDays: supply.days,
        price: supply.price,
      },
    });
    toast.success('Added to cart!');
  };

  const handleRemoveFromCart = (item: CartItem) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
    toast.success('Removed from cart');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="search-container relative mb-16">
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-4 rounded-full animate-float">
                <Pill className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Your Medications
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Compare prices and find the best pharmacy near you
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
          <SearchBar onSearch={handleSearch} setSearchedMedication={setSearchQuery} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          searchQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Available at {pharmacies.length} Pharmacies
                  </h2>
                  <div className="space-y-6">
                    {pharmacies.map((pharmacy) => (
                      <PharmacyCard
                        key={pharmacy.id}
                        pharmacy={pharmacy}
                        onAddToCart={(supply) => handleAddToCart(pharmacy.id, supply)}
                        medicineName={searchedMedicationName}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <AlternativeMeds
                  alternatives={alternatives}
                  onSelect={handleSearch}
                />
              </div>
            </div>
          )
        )}

        <Cart
          items={state.items}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          searchedMedication={searchedMedicationName} // Pass the searched medication name
        />
      </main>
    </div>
  );
}
