'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Star, Users, Car } from 'lucide-react';
import { communityCentersData } from './data';

const CommunityCenterCard = ({ center }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl">
      <img src={center.image} className="h-56 w-full object-cover" />

      <div className="p-5">
        <h3 className="text-xl font-bold">{center.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{center.tagline}</p>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={16} /> {center.location}
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Users size={16} /> {center.capacity}
          </span>
          <span className="flex items-center gap-1">
            <Car size={16} /> {center.parking}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <Star className="fill-yellow-400 text-yellow-400" size={16} />
          <span>{center.rating} ({center.reviewCount})</span>
        </div>

        <button
          onClick={() => router.push(`/community-centers/${center.id}`)}
          className="w-full bg-cyan-600 text-white py-3 rounded-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default function CommunityCentersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {communityCentersData.map(center => (
        <CommunityCenterCard key={center.id} center={center} />
      ))}
    </div>
  );
}
