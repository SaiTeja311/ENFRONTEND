import axios from 'axios';

const GOODRX_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
const API_BASE_URL = 'https://api.goodrx.com/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GOODRX_API_KEY}`,
  },
});

export const searchMedications = async (query: string) => {
  try {
    const response = await api.get('/drugs/suggest', {
      params: {
        query,
        limit: 20, // Increased limit to get more suggestions
      },
    });

    // Transform all suggestions into medications
    return {
      data: {
        medications: response.data.suggestions.map((suggestion: any) => ({
          id: suggestion.drug_id || String(Math.random()),
          name: suggestion.display_name || suggestion.name,
          description: suggestion.label || `${suggestion.display_name} tablets`,
          alternatives: response.data.suggestions
            .filter((alt: any) => alt.drug_id !== suggestion.drug_id)
            .slice(0, 3)
            .map((alt: any) => alt.display_name),
        })) || [
          {
            id: '1',
            name: query || 'Lipitor',
            description: 'Atorvastatin 40mg tablets',
            alternatives: [
              'Generic Atorvastatin 20mg',
              'Crestor 10mg',
              'Pravastatin 40mg',
            ],
          },
        ],
      },
    };
  } catch (error) {
    console.error('GoodRx API Error:', error);
    return {
      data: {
        medications: [
          {
            id: '1',
            name: query || 'Lipitor',
            description: 'Atorvastatin 40mg tablets',
            alternatives: [
              'Generic Atorvastatin 20mg',
              'Crestor 10mg',
              'Pravastatin 40mg',
            ],
          },
        ],
      },
    };
  }
};

export const getPharmacies = async (medicationId: string) => {
  try {
    // Get user's location (you might want to get this from the user)
    const defaultLocation = {
      latitude: 40.7128,  // Default to NYC coordinates
      longitude: -74.0060
    };

    // Make multiple API calls with different radiuses to get more results
    const radiusOptions = [5, 10, 15]; // miles
    const allResponses = await Promise.all(
      radiusOptions.map(radius =>
        api.get('/drug-prices', {
          params: {
            drug_id: medicationId,
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            radius: radius,
          },
        })
      )
    );

    // Combine and deduplicate pharmacy results
    const seenPharmacyIds = new Set();
    const allPharmacies = allResponses.flatMap(response => 
      (response.data.prices || []).map((price: any) => {
        if (seenPharmacyIds.has(price.pharmacy.id)) {
          return null;
        }
        seenPharmacyIds.add(price.pharmacy.id);
        
        return {
          id: price.pharmacy.id,
          name: price.pharmacy.name,
          distance: Number(price.pharmacy.distance || 0).toFixed(1),
          hasDelivery: price.pharmacy.has_delivery || false,
          logo: price.pharmacy.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${price.pharmacy.name}`,
          supplyOptions: [
            {
              days: price.days_supply || 30,
              price: Number(price.price).toFixed(2),
              available: true,
            },
            // Add additional supply options if available
            ...(price.other_quantities || []).map((qty: any) => ({
              days: qty.days_supply,
              price: Number(qty.price).toFixed(2),
              available: true,
            })),
          ],
        };
      }).filter(Boolean)
    );

    // If no results from API, use fallback data
    if (allPharmacies.length === 0) {
      return {
        data: {
          pharmacies: [
            {
              id: '1',
              name: 'CVS Pharmacy',
              distance: 2.3,
              hasDelivery: true,
              logo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              supplyOptions: [
                { days: 30, price: 24.99, available: true },
                { days: 60, price: 44.99, available: true },
              ],
            },
            {
              id: '2',
              name: 'Carelon Pharmacy',
              distance: 3.8,
              hasDelivery: true,
              logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              supplyOptions: [
                { days: 30, price: 22.99, available: true },
                { days: 90, price: 59.99, available: true },
              ],
            },
          ],
        },
      };
    }

    return {
      data: {
        pharmacies: allPharmacies,
      },
    };
  } catch (error) {
    console.error('GoodRx API Error:', error);
    return {
      data: {
        pharmacies: [
          {
            id: '1',
            name: 'CVS Pharmacy',
            distance: 2.3,
            hasDelivery: true,
            logo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            supplyOptions: [
              { days: 30, price: 24.99, available: true },
              { days: 60, price: 44.99, available: true },
            ],
          },
          {
            id: '2',
            name: 'Carelon Pharmacy',
            distance: 3.8,
            hasDelivery: true,
            logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            supplyOptions: [
              { days: 30, price: 22.99, available: true },
              { days: 90, price: 59.99, available: true },
            ],
          },
        ],
      },
    };
  }
};

export const submitOrder = async (orderData: any) => {
  return Promise.resolve({
    data: {
      orderId: '12345',
      status: 'confirmed',
      estimatedDelivery: '2024-03-20',
    },
  });
};