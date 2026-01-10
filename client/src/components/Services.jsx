import React from 'react';
import Link from 'next/link';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const ServiceCard = ({ icon, title, description, count, countLabel, rating, href }) => {
  return (
    <Link href={href}>
      <div className="border-2 border-cyan-400 rounded-2xl p-6 bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer h-full">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="text-6xl">
            {icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-outfit font-bold text-center mb-3 text-gray-900">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-center text-gray-600 text-sm mb-6 min-h-[48px]">
          {description}
        </p>
        
        {/* Stats */}
        <div className="flex justify-between items-end pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {count}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              {countLabel}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {rating}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Rating
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Services = () => {
  const services = [
    {
      icon: '🎬',
      title: 'Production Houses',
      description: 'Full event production services including sound, lighting, and stage management',
      count: '150+',
      countLabel: 'Providers',
      rating: '4.8★',
      href: 'production-houses'
    },
    {
      icon: '🏛️',
      title: 'Community Centers',
      description: 'Perfect event venues with all necessary facilities and amenities',
      count: '120+',
      countLabel: 'Venues',
      rating: '4.6★',
      href: 'community-centers'
    },
    {
      icon: '📋',
      title: 'Event Management',
      description: 'Professional event planners and coordinators for seamless execution',
      count: '200+',
      countLabel: 'Managers',
      rating: '4.9★',
      href: 'event-management'
    },
    {
      icon: '📸',
      title: 'Photographers',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      href: 'photographers'
    },
    {
      icon: '🎥',
      title: 'Cinematographers',
      description: 'Professional video services to create lasting memories of your event',
      count: '180+',
      countLabel: 'Videographers',
      rating: '4.8★',
      href: 'cinematographers'
    },
    {
      icon: '👨‍🍳',
      title: 'Cooks & Caterers',
      description: 'Delicious catering options from professional chefs and catering services',
      count: '250+',
      countLabel: 'Caterers',
      rating: '4.9★',
      href: 'cooks-caterers'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-cyan-50 px-8 py-3 rounded-full mb-6">
            <h2 className="text-3xl font-outfit  md:text-4xl font-bold text-cyan-500">
              Our Professional Services
            </h2>
          </div>
          <p className="text-xl md:text-2xl font-outfit  text-gray-800 font-medium max-w-4xl mx-auto">
            Connect with trusted event professionals for every aspect of your event
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              count={service.count}
              countLabel={service.countLabel}
              rating={service.rating}
              href={service.href}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Services;