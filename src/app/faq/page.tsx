'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is Luxeline?',
    answer: 'Luxeline is a global fashion and lifestyle online retailer dedicated to making the beauty of fashion accessible to all.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email. You can use it to track your order status online.',
  },
  {
    question: 'What is your return policy?',
    answer: 'You can return items within 30 days of delivery. Items must be unused and in original packaging. See our returns page for full details.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 150 countries. Shipping fees and times vary depending on the destination.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-700 mb-4">
            <span className="text-orange-500">Frequently</span> Asked Questions
          </h2>
          <p className="text-lg text-gray-600">Answers to our most common queries</p>
        </div>

        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left px-6 py-5 text-gray-700 font-semibold focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  {faq.question}
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 border-t border-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
