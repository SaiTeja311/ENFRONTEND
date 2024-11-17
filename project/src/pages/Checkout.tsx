
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CreditCard, Truck, User } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { submitOrder } from '../services/api';
// import toast from 'react-hot-toast';

// export function CheckoutPage() {
//   const navigate = useNavigate();
//   const { state, dispatch } = useCart();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     cardNumber: '',
//     expiry: '',
//     cvv: '', // Store the raw CVV value
//   });

//   // Function to mask the card number and display the first 4 and last 4 digits
//   const maskCardNumber = (cardNumber: string) => {
//     if (cardNumber.length >= 8) {
//       return cardNumber.slice(0, 4) + 'X'.repeat(cardNumber.length - 8) + cardNumber.slice(-4);
//     }
//     return cardNumber;
//   };

//   // Mask CVV digits with '*' while keeping the actual value for processing
//   const maskCVV = (cvv: string) => {
//     return '*'.repeat(cvv.length); // Mask all entered digits with '*'
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await submitOrder({
//         items: state.items,
//         total: state.total,
//         shipping: formData,
//       });

//       dispatch({ type: 'CLEAR_CART' });
//       toast.success('Order placed successfully!');
//       navigate(`/order-confirmation/${response.data.orderId}`);
//     } catch (error) {
//       toast.error('Failed to place order. Please try again.');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     // Handle cardNumber and cvv separately to avoid interference with masking logic
//     if (name === 'cvv') {
//       if (/^\d{0,3}$/.test(value)) { // Limit the CVV input to 3 digits
//         setFormData({
//           ...formData,
//           [name]: value, // Store the actual CVV value
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//   <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//     {/* Left Side: Form for Contact, Shipping, and Payment Information */}
//     <div>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <section className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-2 mb-4">
//             <User className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold">Contact Information</h2>
//           </div>
//           <div className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               required
//               className="w-full p-2 border rounded"
//               onChange={handleChange}
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               className="w-full p-2 border rounded"
//               onChange={handleChange}
//             />
//           </div>
//         </section>

//         <section className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-2 mb-4">
//             <Truck className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold">Shipping Address</h2>
//           </div>
//           <div className="space-y-4">
//             <input
//               type="text"
//               name="address"
//               placeholder="Street Address"
//               required
//               className="w-full p-2 border rounded"
//               onChange={handleChange}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 required
//                 className="w-full p-2 border rounded"
//                 onChange={handleChange}
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 required
//                 className="w-full p-2 border rounded"
//                 onChange={handleChange}
//               />
//             </div>
//             <input
//               type="text"
//               name="zip"
//               placeholder="ZIP Code"
//               required
//               className="w-full p-2 border rounded"
//               onChange={handleChange}
//             />
//           </div>
//         </section>

//         <section className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-2 mb-4">
//             <CreditCard className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold">Payment Information</h2>
//           </div>
//           <div className="space-y-4">
//             <input
//               type="text"
//               name="cardNumber"
//               placeholder="Card Number"
//               required
//               className="w-full p-2 border rounded"
//               maxLength={16}
//               onChange={handleChange}
//               value={maskCardNumber(formData.cardNumber)} // Display the masked value
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="expiry"
//                 placeholder="MM/YY"
//                 required
//                 className="w-full p-2 border rounded"
//                 onChange={handleChange}
//               />
//               <input
//                 type="password"
//                 name="cvv"
//                 placeholder="CVV"
//                 required
//                 maxLength={3} // Limit to 3 digits
//                 className="w-full p-2 border rounded"
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         </section>
//       </form>
//     </div>

//     {/* Right Side: Order Summary */}
//     <div>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//         <div className="space-y-4">
//           {state.items.map((item) => (
//             <div
//               key={`${item.medicationId}-${item.pharmacyId}`}
//               className="flex justify-between py-2 border-b"
//             >
//               <div>
//                 <p className="font-medium">{item.medicationId}</p>
//                 <p className="text-sm text-gray-600">{item.supplyDays}-day supply</p>
//               </div>
//               <span className="font-medium">${item.price.toFixed(2)}</span>
//             </div>
//           ))}
//           <div className="flex justify-between pt-4 font-semibold">
//             <span>Total</span>
//             <span>${state.total.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//       {/* Place Order Button */}
//       <div className="mt-4">
//         <button
//           type="submit"
//           onClick={handleSubmit} // Separate button for submission
//           className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Place Order
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//   );
// }


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CreditCard, Truck, User } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { submitOrder } from '../services/api';
// import toast from 'react-hot-toast';

// export function CheckoutPage() {
//   const navigate = useNavigate();
//   const { state, dispatch } = useCart();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     cardNumber: '',
//     expiry: '',
//     cvv: '', // Store the raw CVV value
//   });

//   // Function to mask the card number and display the first 4 and last 4 digits
//   const maskCardNumber = (cardNumber: string) => {
//     if (cardNumber.length >= 8) {
//       return cardNumber.slice(0, 4) + 'X'.repeat(cardNumber.length - 8) + cardNumber.slice(-4);
//     }
//     return cardNumber;
//   };

//   // Mask CVV digits with '*' while keeping the actual value for processing
//   const maskCVV = (cvv: string) => {
//     return '*'.repeat(cvv.length); // Mask all entered digits with '*'
//   };

//   // Validation for required fields
//   const validateForm = () => {
//     const requiredFields = [
//       'name',
//       'email',
//       'address',
//       'city',
//       'state',
//       'zip',
//       'cardNumber',
//       'expiry',
//       'cvv',
//     ];

//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form before submitting
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const response = await submitOrder({
//         items: state.items,
//         total: state.total,
//         shipping: formData,
//       });

//       dispatch({ type: 'CLEAR_CART' });
//       toast.success('Order placed successfully!');
//       navigate(`/order-confirmation/${response.data.orderId}`);
//     } catch (error) {
//       toast.error('Failed to place order. Please try again.');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     // Handle cardNumber and cvv separately to avoid interference with masking logic
//     if (name === 'cvv') {
//       if (/^\d{0,3}$/.test(value)) { // Limit the CVV input to 3 digits
//         setFormData({
//           ...formData,
//           [name]: value, // Store the actual CVV value
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <section className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center gap-2 mb-4">
//                 <User className="w-5 h-5 text-blue-600" />
//                 <h2 className="text-xl font-semibold">Contact Information</h2>
//               </div>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Full Name"
//                   required
//                   className="w-full p-2 border rounded"
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   required
//                   className="w-full p-2 border rounded"
//                   onChange={handleChange}
//                 />
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center gap-2 mb-4">
//                 <Truck className="w-5 h-5 text-blue-600" />
//                 <h2 className="text-xl font-semibold">Shipping Address</h2>
//               </div>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   name="address"
//                   placeholder="Street Address"
//                   required
//                   className="w-full p-2 border rounded"
//                   onChange={handleChange}
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     required
//                     className="w-full p-2 border rounded"
//                     onChange={handleChange}
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     required
//                     className="w-full p-2 border rounded"
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   name="zip"
//                   placeholder="ZIP Code"
//                   required
//                   className="w-full p-2 border rounded"
//                   onChange={handleChange}
//                 />
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center gap-2 mb-4">
//                 <CreditCard className="w-5 h-5 text-blue-600" />
//                 <h2 className="text-xl font-semibold">Payment Information</h2>
//               </div>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   name="cardNumber"
//                   placeholder="Card Number"
//                   required
//                   className="w-full p-2 border rounded"
//                   maxLength={16}
//                   onChange={handleChange}
//                   value={maskCardNumber(formData.cardNumber)} // Display the masked value
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="expiry"
//                     placeholder="MM/YY"
//                     required
//                     className="w-full p-2 border rounded"
//                     onChange={handleChange}
//                   />
//                   <input
//                     type="password"
//                     name="cvv"
//                     placeholder="CVV"
//                     required
//                     maxLength={3} // Limit to 3 digits
//                     className="w-full p-2 border rounded"
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             </section>

//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Place Order
//             </button>
//           </form>
//         </div>

//         <div>
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//             <div className="space-y-4">
//               {state.items.map((item) => (
//                 <div
//                   key={`${item.medicationId}-${item.pharmacyId}`}
//                   className="flex justify-between py-2 border-b"
//                 >
//                   <div>
//                     <p className="font-medium">{item.medicationId}</p>
//                     <p className="text-sm text-gray-600">{item.supplyDays}-day supply</p>
//                   </div>
//                   <span className="font-medium">${item.price.toFixed(2)}</span>
//                 </div>
//               ))}
//               <div className="flex justify-between pt-4 font-semibold">
//                 <span>Total</span>
//                 <span>${state.total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';
import toast from 'react-hot-toast';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '', // Store the raw CVV value
  });

  // Function to mask the card number and display the first 4 and last 4 digits
  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length >= 8) {
      return cardNumber.slice(0, 4) + 'X'.repeat(cardNumber.length - 8) + cardNumber.slice(-4);
    }
    return cardNumber;
  };

  // Mask CVV digits with '*' while keeping the actual value for processing
  // const maskCVV = (cvv: string) => {
  //   return '*'.repeat(cvv.length); // Mask all entered digits with '*'
  // };

  // Validation for required fields
  // const validateForm = () => {
  //   const requiredFields = [
  //     'name',
  //     'email',
  //     'address',
  //     'city',
  //     'state',
  //     'zip',
  //     'cardNumber',
  //     'expiry',
  //     'cvv',
  //   ];
  //   for (let field of requiredFields) {
  //     if (!formData[field]) {
  //       toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
  //       return false;
  //     }
  //   }
  //   return true;
  // };
  const validateForm = () => {
    const requiredFields: Array<keyof typeof formData> = [
      'name',
      'email',
      'address',
      'city',
      'state',
      'zip',
      'cardNumber',
      'expiry',
      'cvv',
    ];
  
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        return false;
      }
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      const response = await submitOrder({
        items: state.items,
        total: state.total,
        shipping: formData,
      });

      dispatch({ type: 'CLEAR_CART' });
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle cardNumber and cvv separately to avoid interference with masking logic
    if (name === 'cvv') {
      if (/^\d{0,3}$/.test(value)) { // Limit the CVV input to 3 digits
        setFormData({
          ...formData,
          [name]: value, // Store the actual CVV value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
  
      {/* Form wrapping both left and right sections */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Contact, Shipping, Payment */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
          </section>
  
          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                />
              </div>
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
          </section>
  
          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                required
                className="w-full p-2 border rounded"
                maxLength={16}
                onChange={handleChange}
                value={maskCardNumber(formData.cardNumber)} // Display the masked value
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="month"
                  name="expiry"
                  placeholder="MM/YY"
                  required
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  required
                  maxLength={3} // Limit to 3 digits
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>
  
        {/* Right Side: Order Summary and Place Order */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={`${item.medicationId}-${item.pharmacyId}`}
                  className="flex justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.medicationId}</p>
                    <p className="text-sm text-gray-600">{item.supplyDays}-day supply</p>
                  </div>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-semibold">
                <span>Total</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );  
}


