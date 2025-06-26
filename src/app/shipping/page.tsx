'use client';
import { Truck, Timer, RefreshCw } from 'lucide-react';
import React from 'react';

export default function ShippingInfo() {
  return (
    <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-700 mb-4">
            <span className="text-orange-500">Shipping</span> Information
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our delivery process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fast Delivery */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex justify-center mb-4">
              <Truck className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Fast & Reliable Delivery</h3>
            <p className="text-gray-600">
              We offer fast shipping across 150+ countries. Most orders are processed within 1–3 business days.
            </p>
          </div>

          {/* Delivery Time */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex justify-center mb-4">
              <Timer className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Estimated Arrival</h3>
            <p className="text-gray-600">
              Shipping times vary by region. Typically, delivery takes 5–12 business days after dispatch.
            </p>
          </div>

          {/* Returns */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Easy Returns</h3>
            <p className="text-gray-600">
              If you&apos;re not satisfied with your order, return it within 30 days. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
