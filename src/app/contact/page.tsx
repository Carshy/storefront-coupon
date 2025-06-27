'use client';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import React from 'react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-700 mb-4">
            Get in <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-lg text-gray-600">
            We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>

          <div className="space-y-10 text-gray-700">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Email</h4>
                <p>support@luxeline.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Phone</h4>
                <p>+254 (17) 684-174</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Office</h4>
                <p>123 Brookside Avenue,<br />Westlands, Nairobi 10001</p>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-lg font-semibold mb-2">Working Hours</h4>
              <p>Monday - Friday: 9:00 AM – 6:00 PM</p>
              <p>Saturday: 10:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
