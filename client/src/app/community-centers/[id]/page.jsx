'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  Users,
  Car,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { communityCentersData } from '../data';

/* ---------------- IMAGE SLIDER ---------------- */
const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative h-[420px] rounded-2xl overflow-hidden">
      <img
        src={images[index]}
        className="w-full h-full object-cover"
        alt="Community Center"
      />

      <button
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => setIndex((index + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

/* ---------------- PACKAGE CARD ---------------- */
const PackageCard = ({ pkg }) => (
  <div className={`bg-white rounded-xl p-6 shadow ${pkg.popular ? 'ring-2 ring-cyan-500' : ''}`}>
    {pkg.popular && (
      <div className="text-center text-sm font-semibold text-cyan-600 mb-2">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
    <p className="text-3xl font-bold text-cyan-600 mb-1">
      ৳{pkg.price.toLocaleString()}
    </p>
    <p className="text-sm text-gray-500 mb-4">{pkg.duration}</p>

    <ul className="space-y-2 mb-4">
      {pkg.features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-700">
          <CheckCircle size={18} className="text-green-500" />
          {f}
        </li>
      ))}
    </ul>

    <button className="w-full bg-cyan-600 text-white py-2 rounded-lg">
      Select Package
    </button>
  </div>
);

/* ---------------- MAIN PAGE ---------------- */
export default function CommunityCenterDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const center = communityCentersData.find(c => c.id === Number(id));

  const [paid, setPaid] = useState(false);

  if (!center) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Community Center not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* BACK */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.push('/community-centers')}
          className="flex items-center gap-2 text-cyan-600 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Community Centers
        </button>
      </div>

      {/* SLIDER */}
      <div className="max-w-7xl mx-auto px-4">
        <ImageSlider images={center.images} />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* HEADER */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold">{center.name}</h1>
                <p className="text-gray-600 italic">{center.tagline}</p>
              </div>
              {center.available ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex gap-2">
                  <CheckCircle /> Available
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full flex gap-2">
                  <XCircle /> Booked
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" />
                {center.rating} ({center.reviewCount})
              </span>
              <span className="flex items-center gap-2">
                <MapPin /> {center.fullAddress}
              </span>
              <span className="flex items-center gap-2">
                <Users /> {center.capacity}
              </span>
              <span className="flex items-center gap-2">
                <Car /> {center.parking}
              </span>
            </div>
          </div>

          {/* SERVICES */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {center.services.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle className="text-cyan-600" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* PACKAGES */}
          <div className="bg-cyan-50 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Packages</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {center.packages.map((pkg, i) => (
                <PackageCard key={i} pkg={pkg} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white p-6 rounded-xl shadow sticky top-6 h-fit">
          <h3 className="text-xl font-bold mb-4">Contact & Booking</h3>

          {!paid ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Pay a small booking fee to unlock contact details
              </p>
              <button
                onClick={() => setPaid(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Pay ৳500 to Unlock Contact
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="text-cyan-600" />
                {center.contact.phone}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-cyan-600" />
                {center.contact.email}
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-cyan-600" />
                {center.contact.hours}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <Shield className="text-cyan-600" />
                Verified Venue
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
