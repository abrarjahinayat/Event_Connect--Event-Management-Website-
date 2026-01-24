'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, TrendingUp, Star, Users, ArrowRight } from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  count, 
  countLabel, 
  avgRating, 
  totalReviews,
  href,
  isLoading 
}) => {
  return (
    <Link href={href}>
      <div className="group relative border-2 border-cyan-400/30 rounded-2xl p-6 bg-white hover:border-cyan-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer h-full overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-outfit font-bold text-center mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-center text-gray-600 text-sm mb-6 min-h-[48px]">
            {description}
          </p>
          
          {/* Stats */}
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end pt-4 border-t border-gray-200 group-hover:border-cyan-300 transition-colors">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5 text-cyan-500" />
                    <span className="text-3xl font-bold text-cyan-500 group-hover:text-cyan-600 transition-colors">
                      {count}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    {countLabel}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-bold text-yellow-500">
                      {avgRating}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    {totalReviews} Reviews
                  </div>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center justify-center gap-2 text-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-semibold">Explore Services</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </>
          )}
        </div>

        {/* Decorative Corner Element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
      </div>
    </Link>
  );
};

const Services = () => {
  const [servicesData, setServicesData] = useState({});
  const [loading, setLoading] = useState(true);

  // Service categories configuration
  const serviceCategories = [
    {
      id: 'Production Houses',
      icon: '🎬',
      title: 'Production Houses',
      description: 'Full event production services including sound, lighting, and stage management',
      href: '/production-houses'
    },
    {
      id: 'Community Centers',
      icon: '🏛️',
      title: 'Community Centers',
      description: 'Perfect event venues with all necessary facilities and amenities',
      href: '/community-centers'
    },
    {
      id: 'Event Management',
      icon: '📋',
      title: 'Event Management',
      description: 'Professional event planners and coordinators for seamless execution',
      href: '/event-management'
    },
    {
      id: 'Photographers',
      icon: '📸',
      title: 'Photographers',
      description: 'Capture your special moments with professional photography services',
      href: '/photographers'
    },
    {
      id: 'Cinematographers',
      icon: '🎥',
      title: 'Cinematographers',
      description: 'Professional video services to create lasting memories of your event',
      href: '/cinematographers'
    },
    {
      id: 'Cooks & Caterers',
      icon: '👨‍🍳',
      title: 'Cooks & Caterers',
      description: 'Delicious catering options from professional chefs and catering services',
      href: '/cooks-caterers'
    }
  ];

  useEffect(() => {
    fetchServicesStats();
  }, []);

  const fetchServicesStats = async () => {
    try {
      setLoading(true);
      const statsPromises = serviceCategories.map(async (category) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/services/allservices?serviceCategory=${encodeURIComponent(category.id)}`
          );
          
          const data = await response.json();
          
          if (data.success && data.data) {
            // Calculate statistics
            const services = data.data;
            const count = services.length;
            
            // Calculate average rating
            const totalRating = services.reduce((sum, service) => sum + (service.rating || 0), 0);
            const avgRating = count > 0 ? (totalRating / count).toFixed(1) : '0.0';
            
            // Calculate total reviews
            const totalReviews = services.reduce((sum, service) => sum + (service.reviewCount || 0), 0);
            
            return {
              category: category.id,
              count,
              avgRating,
              totalReviews
            };
          }
          
          return {
            category: category.id,
            count: 0,
            avgRating: '0.0',
            totalReviews: 0
          };
        } catch (error) {
          console.error(`Error fetching ${category.id}:`, error);
          return {
            category: category.id,
            count: 0,
            avgRating: '0.0',
            totalReviews: 0
          };
        }
      });

      const results = await Promise.all(statsPromises);
      
      // Convert array to object for easy lookup
      const statsMap = results.reduce((acc, stat) => {
        acc[stat.category] = stat;
        return acc;
      }, {});
      
      setServicesData(statsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services stats:', error);
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-cyan-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Container>
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-full mb-6">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm uppercase tracking-wide">
              Trending Services
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-outfit font-bold text-gray-900 mb-4">
            Our Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Services</span>
          </h2>
          
          <p className="text-xl md:text-2xl font-outfit text-gray-600 max-w-3xl mx-auto">
            Connect with trusted event professionals for every aspect of your event
          </p>
          
          {/* Stats Bar */}
          {!loading && (
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">
                  {Object.values(servicesData).reduce((sum, stat) => sum + stat.count, 0)}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Providers</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {(Object.values(servicesData).reduce((sum, stat) => sum + parseFloat(stat.avgRating), 0) / serviceCategories.length).toFixed(1)}★
                </div>
                <div className="text-sm text-gray-600 font-medium">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Object.values(servicesData).reduce((sum, stat) => sum + stat.totalReviews, 0)}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Reviews</div>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 relative z-10">
          {serviceCategories.map((service, index) => {
            const stats = servicesData[service.id] || { count: 0, avgRating: '0.0', totalReviews: 0 };
            
            return (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  count={stats.count}
                  countLabel="Providers"
                  avgRating={stats.avgRating}
                  totalReviews={stats.totalReviews}
                  href={service.href}
                  isLoading={loading}
                />
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        
      </Container>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Services;