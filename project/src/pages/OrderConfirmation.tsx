import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Download, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateOrderPDF } from '../utils/pdfGenerator';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { state } = useCart();

  const handleDownload = () => {
    const doc = generateOrderPDF(orderId || '', state.items, state.total);
    doc.save(`order-${orderId}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your order. Your order number is #{orderId}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Order Status</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Status</span>
            <span className="font-medium text-green-600">Processing</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Estimated Delivery</span>
            <span className="font-medium">March 20, 2024</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            {state.items.map((item) => (
              <div
                key={`${item.medicationId}-${item.pharmacyId}`}
                className="flex justify-between text-sm"
              >
                <span>{item.medicationId} ({item.supplyDays}-day supply)</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Receipt
        </button>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}