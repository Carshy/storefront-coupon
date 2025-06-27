'use client';
import React, { ReactNode } from 'react';
import { Users, UserCheck, Globe, TrendingUp, Sparkles, Heart, Star } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
  spin?: boolean;
}

function StatCard({
  icon,
  title,
  subtitle,
  bgFrom,
  bgTo,
  textColor,
  spin = false,
}: StatCardProps) {
  return (
    <div className="group">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br from-${bgFrom}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative z-10">
          <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${bgFrom} to-${bgTo} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-500`}>
            <div className={spin ? "animate-spin" : ""} style={{ animationDuration: spin ? '10s' : undefined }}>
              {icon}
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">{title}</h3>
          <p className={`text-${textColor} font-semibold text-lg`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutLuxeline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <section className="min-h-screen flex items-center justify-center bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-orange-500 animate-spin" />
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent leading-tight">
                  About
                </h1>
              </div>
              <div className="relative">
                <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-700 mb-4 relative">
                  Luxeline
                  <div className="absolute inset-0 bg-orange-500/10 blur-2xl -z-10 animate-pulse"></div>
                </h2>
                <div className="w-24 h-2 bg-orange-500 rounded-full mx-auto lg:mx-0 animate-pulse"></div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-500/10 rounded-tr-3xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-6 h-6 text-orange-600 animate-pulse" />
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Our Story</span>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                    <span className="font-bold text-orange-600">Luxeline</span> is a global fashion and lifestyle online retailer committed to making the beauty of fashion accessible to all. We use on-demand manufacturing technology to connect suppliers to our agile supply chain, reducing inventory waste and enabling us to deliver a variety of affordable products to customers around the world.
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      From our global offices, we reach customers in more than 150 countries.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_25%,white_1px,transparent_1px),radial-gradient(circle_at_75%_75%,white_1px,transparent_1px)] bg-[length:50px_50px] animate-float"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">
              Luxeline at a <span className="text-orange-500">Glance</span>
            </h2>
            <div className="w-32 h-1 bg-orange-600 rounded-full mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={<Users className="w-10 h-10 text-white" />} title="500+" subtitle="Employees Worldwide" bgFrom="orange-500" bgTo="orange-600" textColor="orange-300" />
            <StatCard icon={<UserCheck className="w-10 h-10 text-gray-700" />} title="65%" subtitle="Female Leadership" bgFrom="gray-200" bgTo="gray-100" textColor="green-200" />
            <StatCard icon={<TrendingUp className="w-10 h-10 text-gray-700" />} title="35%" subtitle="Male Innovation" bgFrom="gray-100" bgTo="gray-50" textColor="green-200" />
            <StatCard icon={<Globe className="w-10 h-10 text-white" />} title="150+" subtitle="Countries Served" bgFrom="green-500" bgTo="green-500" textColor="green-200" spin />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-orange-600 animate-pulse" />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-5xl font-black text-gray-700 mb-6">
                Making the Beauty of
                <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Fashion Accessible
                </span>
                <span className="block">to All</span>
              </h2>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="w-16 h-1 bg-orange-600 rounded-full"></div>
                <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                <div className="w-16 h-1 bg-orange-500 rounded-full"></div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-100 rounded-tr-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-orange-500 fill-current animate-pulse" />
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Our Philosophy</span>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-700 mb-6">
                    Consumers no longer follow a unified standard of what is considered fashionable or beautiful. We believe that the clothes we wear reflect our personalities and we want to empower everyone to explore and express their individuality.
                  </p>
                  <p className="text-lg sm:text-xl text-gray-700">
                    To do this, <span className="font-bold text-orange-600">Luxeline</span> creates a wide range of options to fit any mood or occasion, ensuring everyone can find their perfect style.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">Individual Expression</span>
                    <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">Diverse Styles</span>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Global Fashion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
