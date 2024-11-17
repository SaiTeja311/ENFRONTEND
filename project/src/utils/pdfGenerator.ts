import jsPDF from 'jspdf';
import type { CartItem } from '../types';

export const generateOrderPDF = (orderId: string, items: CartItem[], total: number) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.text('Order Summary', pageWidth / 2, 20, { align: 'center' });
  
  // Order ID
  doc.setFontSize(12);
  doc.text(`Order #${orderId}`, 20, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
  
  // Items
  doc.setFontSize(14);
  doc.text('Items:', 20, 70);
  
  let yPosition = 80;
  items.forEach((item) => {
    doc.setFontSize(12);
    doc.text(`${item.medicationId} (${item.supplyDays}-day supply)`, 20, yPosition);
    doc.text(`$${item.price.toFixed(2)}`, pageWidth - 40, yPosition, { align: 'right' });
    yPosition += 10;
  });
  
  // Total
  doc.line(20, yPosition + 5, pageWidth - 20, yPosition + 5);
  yPosition += 15;
  doc.setFontSize(14);
  doc.text('Total:', 20, yPosition);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 40, yPosition, { align: 'right' });
  
  // Footer
  const footerText = 'Thank you for your order!';
  doc.setFontSize(12);
  doc.text(footerText, pageWidth / 2, yPosition + 30, { align: 'center' });
  
  return doc;
};