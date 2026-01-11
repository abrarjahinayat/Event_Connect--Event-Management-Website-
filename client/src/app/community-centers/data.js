export const communityCentersData = [
  {
    id: 1,
    name: "Gulshan Community Center",
    tagline: "Premium Events in the Heart of Dhaka",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    location: "Gulshan, Dhaka",
    fullAddress: "House 12, Road 90, Gulshan-2, Dhaka",
    startingPrice: 80000,
    available: true,
    rating: 4.8,
    reviewCount: 210,

    capacity: "500 Guests",
    parking: "200 Cars",

    services: [
      "Wedding Ceremony",
      "Wedding Reception",
      "Corporate Events",
      "Birthday Parties",
      "Engagement Programs"
    ],

    packages: [
      {
        name: "Wedding Package",
        price: 150000,
        duration: "1 Day",
        features: [
          "Hall Decoration",
          "Stage & Lighting",
          "Sound System",
          "Generator Backup",
          "Security"
        ],
        popular: true
      },
      {
        name: "Corporate Package",
        price: 100000,
        duration: "1 Day",
        features: [
          "Conference Setup",
          "Projector & Screen",
          "Sound System",
          "WiFi",
          "Refreshment Area"
        ],
        popular: false
      }
    ],

    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
      "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=1200"
    ],

    reviews: [
      {
        id: 1,
        name: "Sabbir Ahmed",
        rating: 5,
        date: "3 weeks ago",
        comment: "Excellent venue. Very professional management.",
        avatar: "https://i.pravatar.cc/150?img=31"
      }
    ],

    contact: {
      phone: "+880 1711-123456",
      email: "booking@gulshancc.com",
      hours: "9 AM – 10 PM"
    }
  },

  {
    id: 2,
    name: "Mirpur Convention Hall",
    tagline: "Affordable & Spacious Venue",
    image: "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=800",
    location: "Mirpur, Dhaka",
    fullAddress: "Section 10, Mirpur, Dhaka",
    startingPrice: 60000,
    available: true,
    rating: 4.6,
    reviewCount: 145,
    capacity: "800 Guests",
    parking: "150 Cars",

    services: [
      "Wedding Events",
      "Cultural Programs",
      "Mehendi Night",
      "Birthday Parties"
    ],

    packages: [
      {
        name: "Full Wedding",
        price: 120000,
        duration: "1 Day",
        features: [
          "Full Hall",
          "Decoration",
          "Sound System",
          "Security"
        ],
        popular: true
      }
    ],

    images: [
      "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=1200"
    ],

    reviews: [],

    contact: {
      phone: "+880 1811-987654",
      email: "info@mirpurhall.com",
      hours: "8 AM – 11 PM"
    }
  }
];
