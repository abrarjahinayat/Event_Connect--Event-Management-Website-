// File: src/app/community-centers/data.js

export const communityCentersData = [
  {
    id: 1,
    name: "Gulshan Community Hall",
    tagline: "Premium Event Space in Heart of Dhaka",
    image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=800&h=600&fit=crop",
    location: "Gulshan, Dhaka",
    fullAddress: "House 78, Road 12, Gulshan-2, Dhaka 1212, Bangladesh",
    startingPrice: 80000,
    available: true,
    rating: 4.9,
    reviewCount: 234,
    specialties: ["Wedding", "Corporate Events", "Cultural Programs"],
    capacity: 500,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&h=700&fit=crop"
    ],
    about: "Gulshan Community Hall is Dhaka's premier event venue, perfect for weddings, corporate events, and cultural programs. With elegant interiors, modern amenities, and professional service, we make every event memorable. Our spacious halls can accommodate up to 500 guests with full catering facilities.",
    features: [
      "Air-conditioned main hall (8,000 sq ft)",
      "Seating capacity: 500 guests",
      "Stage with professional lighting",
      "Sound system included",
      "Bridal room & green rooms",
      "In-house catering available",
      "Parking for 50+ vehicles",
      "Generator backup",
      "Decorated entrance",
      "Professional event coordination"
    ],
    services: [
      { icon: "Users", title: "Wedding Ceremonies", description: "Complete wedding event management" },
      { icon: "Briefcase", title: "Corporate Events", description: "Conferences, seminars, and business meetings" },
      { icon: "Music", title: "Cultural Programs", description: "Music concerts, dance shows, and festivals" },
      { icon: "Gift", title: "Social Events", description: "Birthday parties, anniversaries, and celebrations" }
    ],
    packages: [
      {
        name: "Basic Package",
        price: 80000,
        duration: "Half Day (6 hours)",
        features: [
          "Hall rental",
          "Basic decoration",
          "Sound system",
          "150 chairs & tables",
          "Basic lighting",
          "Parking access"
        ],
        popular: false
      },
      {
        name: "Standard Package",
        price: 150000,
        duration: "Full Day (12 hours)",
        features: [
          "Complete hall access",
          "Premium decoration",
          "Professional sound & lighting",
          "Stage setup",
          "Bridal room access",
          "Catering for 300 guests",
          "Event coordinator",
          "Parking & security"
        ],
        popular: true
      },
      {
        name: "Premium Package",
        price: 300000,
        duration: "Full Day + Setup Day",
        features: [
          "Exclusive venue booking",
          "Luxury decoration theme",
          "Premium catering (500 guests)",
          "Professional photography",
          "Live music arrangement",
          "Valet parking service",
          "Wedding planner included",
          "Bridal makeup room",
          "Guest accommodation support"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=600&h=600&fit=crop", title: "Wedding Ceremony" },
      { id: 2, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=600&fit=crop", title: "Corporate Event" },
      { id: 3, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop", title: "Reception" },
      { id: 4, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop", title: "Cultural Program" },
      { id: 5, image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=600&fit=crop", title: "Birthday Party" },
      { id: 6, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop", title: "Anniversary" }
    ],
    reviews: [
      {
        id: 1,
        name: "Nusrat Jahan",
        rating: 5,
        date: "1 week ago",
        comment: "Perfect venue for our wedding! The hall was beautifully decorated and the staff was extremely helpful. Everything was arranged perfectly. Highly recommended!",
        avatar: "https://i.pravatar.cc/150?img=25"
      },
      {
        id: 2,
        name: "Kamal Hossain",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent community center for corporate events. We organized our annual conference here and it was a great success. Professional service and good facilities.",
        avatar: "https://i.pravatar.cc/150?img=13"
      },
      {
        id: 3,
        name: "Fatema Begum",
        rating: 5,
        date: "1 month ago",
        comment: "Booked for my daughter's birthday party. The venue is spacious and clean. Staff was cooperative and catering was delicious. Great value for money!",
        avatar: "https://i.pravatar.cc/150?img=31"
      }
    ],
    amenities: ["AC", "Parking", "Catering", "Stage", "Sound System", "WiFi", "Generator"],
    bookingDeposit: 20000, // Amount to pay to get vendor contact
    verified: true
  },
  {
    id: 2,
    name: "Banani Convention Center",
    tagline: "Modern Venue for Grand Celebrations",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    location: "Banani, Dhaka",
    fullAddress: "Plot 45, Road 27, Banani, Dhaka 1213, Bangladesh",
    startingPrice: 120000,
    available: true,
    rating: 4.8,
    reviewCount: 187,
    specialties: ["Wedding Reception", "Conference", "Seminar"],
    capacity: 800,
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=700&fit=crop"
    ],
    about: "Banani Convention Center is one of Dhaka's largest and most prestigious event venues. With capacity for 800 guests, state-of-the-art facilities, and professional event management, we're the perfect choice for grand weddings, large conferences, and corporate events.",
    features: [
      "12,000 sq ft grand hall",
      "Capacity: 800 guests",
      "VIP lounge area",
      "Professional stage with LED screens",
      "Central AC throughout",
      "Premium sound & lighting",
      "Separate dining area",
      "Bridal & groom suites",
      "Underground parking (100+ cars)",
      "24/7 security with CCTV"
    ],
    services: [
      { icon: "Users", title: "Grand Weddings", description: "Large-scale wedding receptions and ceremonies" },
      { icon: "Briefcase", title: "Corporate Conferences", description: "Business conferences and product launches" },
      { icon: "Music", title: "Entertainment Events", description: "Concerts, award shows, and cultural events" },
      { icon: "Gift", title: "Trade Shows", description: "Exhibitions and trade fair events" }
    ],
    packages: [
      {
        name: "Silver Package",
        price: 120000,
        duration: "8 Hours",
        features: [
          "Hall rental (8 hours)",
          "Standard decoration",
          "Sound & lighting",
          "500 chairs setup",
          "Basic catering setup",
          "Parking included"
        ],
        popular: false
      },
      {
        name: "Gold Package",
        price: 250000,
        duration: "Full Day (12 hours)",
        features: [
          "Complete venue access",
          "Premium decoration theme",
          "Advanced AV equipment",
          "Stage with LED backdrop",
          "Catering for 600 guests",
          "Event management team",
          "Photography area setup",
          "VIP lounge access",
          "Valet parking"
        ],
        popular: true
      },
      {
        name: "Platinum Package",
        price: 500000,
        duration: "2 Days (Setup + Event)",
        features: [
          "Exclusive 2-day booking",
          "Luxury theme decoration",
          "Premium catering (800 guests)",
          "Professional photography & videography",
          "Live band arrangement",
          "Celebrity host coordination",
          "Dedicated event planner",
          "Bridal makeup artist",
          "Guest transportation support",
          "Hotel booking assistance"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=600&h=600&fit=crop", title: "Grand Wedding" },
      { id: 2, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=600&fit=crop", title: "Conference" },
      { id: 3, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop", title: "Reception Hall" }
    ],
    reviews: [
      {
        id: 1,
        name: "Ahmed Rahman",
        rating: 5,
        date: "3 days ago",
        comment: "Amazing venue! We had our wedding reception here with 700 guests. The management was professional and everything went smoothly. Highly recommended for grand events.",
        avatar: "https://i.pravatar.cc/150?img=68"
      },
      {
        id: 2,
        name: "Sabrina Khan",
        rating: 4,
        date: "2 weeks ago",
        comment: "Good venue for large events. The hall is spacious and well-maintained. Only minor issue was parking can get crowded during peak hours.",
        avatar: "https://i.pravatar.cc/150?img=27"
      }
    ],
    amenities: ["AC", "Parking", "Catering", "Stage", "LED Screen", "WiFi", "Generator", "Elevator"],
    bookingDeposit: 30000,
    verified: true
  },
  {
    id: 3,
    name: "Dhanmondi Club House",
    tagline: "Intimate Gatherings in Classic Setting",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
    location: "Dhanmondi, Dhaka",
    fullAddress: "Road 8/A, House 15, Dhanmondi, Dhaka 1209, Bangladesh",
    startingPrice: 45000,
    available: true,
    rating: 4.7,
    reviewCount: 156,
    specialties: ["Small Weddings", "Birthday Party", "Family Gathering"],
    capacity: 200,
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&h=700&fit=crop"
    ],
    about: "Dhanmondi Club House is perfect for intimate gatherings and small celebrations. Our cozy venue with classic decor creates a warm atmosphere for family events, small weddings, and birthday parties. Affordable pricing without compromising quality.",
    features: [
      "3,500 sq ft hall",
      "Capacity: 200 guests",
      "Classic interior design",
      "Air-conditioned",
      "Small stage area",
      "Sound system",
      "Dining area",
      "Preparation room",
      "Outdoor garden space",
      "Free parking (20 cars)"
    ],
    services: [
      { icon: "Users", title: "Small Weddings", description: "Intimate wedding ceremonies and receptions" },
      { icon: "Briefcase", title: "Corporate Meetings", description: "Small business meetings and workshops" },
      { icon: "Music", title: "Birthday Parties", description: "Children and adult birthday celebrations" },
      { icon: "Gift", title: "Family Events", description: "Anniversaries, reunions, and gatherings" }
    ],
    packages: [
      {
        name: "Basic Package",
        price: 45000,
        duration: "6 Hours",
        features: [
          "Hall rental",
          "Simple decoration",
          "Sound system",
          "100 chairs & tables",
          "Basic lighting",
          "Parking"
        ],
        popular: false
      },
      {
        name: "Standard Package",
        price: 75000,
        duration: "10 Hours",
        features: [
          "Full venue access",
          "Themed decoration",
          "Sound & lighting setup",
          "Catering for 150 guests",
          "Stage setup",
          "Event coordinator",
          "Garden access",
          "Photography support"
        ],
        popular: true
      },
      {
        name: "Premium Package",
        price: 120000,
        duration: "Full Day",
        features: [
          "Exclusive booking",
          "Premium decoration",
          "Catering for 200 guests",
          "Photography included",
          "Entertainment setup",
          "Event planner",
          "Garden decoration",
          "Personalized service"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop", title: "Birthday Party" },
      { id: 2, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop", title: "Small Wedding" }
    ],
    reviews: [
      {
        id: 1,
        name: "Rupa Akter",
        rating: 5,
        date: "1 week ago",
        comment: "Perfect for small family weddings! The intimate setting was exactly what we wanted. Staff was friendly and helpful. Affordable pricing too!",
        avatar: "https://i.pravatar.cc/150?img=44"
      }
    ],
    amenities: ["AC", "Parking", "Catering", "Sound System", "Garden", "WiFi"],
    bookingDeposit: 10000,
    verified: true
  },
  {
    id: 4,
    name: "Uttara Royal Banquet",
    tagline: "North Dhaka's Premier Event Venue",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
    location: "Uttara, Dhaka",
    fullAddress: "Sector 10, Road 15, Uttara, Dhaka 1230, Bangladesh",
    startingPrice: 100000,
    available: false,
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Wedding", "Engagement", "Reception"],
    capacity: 600,
    images: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=700&fit=crop"
    ],
    about: "Uttara Royal Banquet is North Dhaka's most sought-after event venue. With royal-themed interiors, modern facilities, and impeccable service, we host the most memorable weddings and receptions in the area. Easy access from airport and main highways.",
    features: [
      "10,000 sq ft royal hall",
      "Capacity: 600 guests",
      "Chandelier lighting",
      "Marble flooring",
      "Bridal stage with backdrop",
      "Professional sound & lights",
      "Multiple green rooms",
      "In-house catering kitchen",
      "Large parking area (80+ cars)",
      "Elevator access"
    ],
    services: [
      { icon: "Users", title: "Wedding Events", description: "Complete wedding planning and execution" },
      { icon: "Briefcase", title: "Engagement Ceremonies", description: "Elegant engagement party arrangements" },
      { icon: "Music", title: "Reception Parties", description: "Grand reception celebrations" },
      { icon: "Gift", title: "Holud Programs", description: "Traditional mehendi and holud ceremonies" }
    ],
    packages: [
      {
        name: "Silver Package",
        price: 100000,
        duration: "8 Hours",
        features: [
          "Hall rental",
          "Royal decoration",
          "Sound & lighting",
          "400 guests seating",
          "Stage decoration",
          "Parking"
        ],
        popular: false
      },
      {
        name: "Gold Package",
        price: 200000,
        duration: "Full Day",
        features: [
          "Complete venue",
          "Premium royal theme",
          "Advanced AV system",
          "Catering for 500 guests",
          "Photography corner",
          "Event coordinator",
          "Bridal suite access",
          "Valet parking"
        ],
        popular: true
      },
      {
        name: "Diamond Package",
        price: 400000,
        duration: "2 Days",
        features: [
          "Exclusive 2-day booking",
          "Luxury decoration",
          "Premium catering (600 guests)",
          "Professional photo/video",
          "Live entertainment",
          "Wedding planner",
          "Makeup artists",
          "Transport coordination",
          "Guest accommodation help"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8b0?w=600&h=600&fit=crop", title: "Royal Wedding" },
      { id: 2, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop", title: "Reception" },
      { id: 3, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=600&fit=crop", title: "Engagement" }
    ],
    reviews: [
      {
        id: 1,
        name: "Imran Hossain",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely stunning venue! Our wedding was perfect. The royal theme decoration was breathtaking. Professional staff and excellent service throughout.",
        avatar: "https://i.pravatar.cc/150?img=52"
      }
    ],
    amenities: ["AC", "Parking", "Catering", "Stage", "Elevator", "WiFi", "Generator", "CCTV"],
    bookingDeposit: 25000,
    verified: true
  },
  {
    id: 5,
    name: "Mirpur Community Complex",
    tagline: "Affordable Events, Quality Service",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop",
    location: "Mirpur, Dhaka",
    fullAddress: "Section 11, Road 9, Mirpur, Dhaka 1216, Bangladesh",
    startingPrice: 35000,
    available: true,
    rating: 4.5,
    reviewCount: 178,
    specialties: ["Budget Wedding", "Social Events", "Community Programs"],
    capacity: 300,
    images: [
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=700&fit=crop"
    ],
    about: "Mirpur Community Complex offers affordable event solutions without compromising quality. Perfect for budget-conscious families looking for a decent venue for weddings, social events, and community programs. Clean, spacious, and well-maintained facility.",
    features: [
      "5,000 sq ft hall",
      "Capacity: 300 guests",
      "Air-conditioned",
      "Basic stage setup",
      "Sound system included",
      "Catering space available",
      "Preparation rooms",
      "Parking for 30 vehicles",
      "Affordable pricing",
      "Community-friendly"
    ],
    services: [
      { icon: "Users", title: "Budget Weddings", description: "Affordable wedding arrangements" },
      { icon: "Briefcase", title: "Social Events", description: "Birthday parties and social gatherings" },
      { icon: "Music", title: "Community Programs", description: "Cultural and religious events" },
      { icon: "Gift", title: "Educational Events", description: "Seminars and training programs" }
    ],
    packages: [
      {
        name: "Economy Package",
        price: 35000,
        duration: "6 Hours",
        features: [
          "Hall rental",
          "Basic decoration",
          "Sound system",
          "150 chairs",
          "Basic lighting"
        ],
        popular: false
      },
      {
        name: "Value Package",
        price: 60000,
        duration: "10 Hours",
        features: [
          "Complete hall access",
          "Decent decoration",
          "Sound & lights",
          "Catering for 250 guests",
          "Stage setup",
          "Coordinator support"
        ],
        popular: true
      },
      {
        name: "Complete Package",
        price: 95000,
        duration: "Full Day",
        features: [
          "Full day booking",
          "Good decoration",
          "Catering for 300 guests",
          "Photography support",
          "Event coordination",
          "Extended hours"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=600&fit=crop", title: "Community Wedding" },
      { id: 2, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop", title: "Social Event" }
    ],
    reviews: [
      {
        id: 1,
        name: "Selim Khan",
        rating: 5,
        date: "1 month ago",
        comment: "Great value for money! We had our wedding here with 250 guests and everything went well. Staff was helpful and the venue was clean. Perfect for budget weddings.",
        avatar: "https://i.pravatar.cc/150?img=64"
      }
    ],
    amenities: ["AC", "Parking", "Catering Space", "Sound System", "Basic Stage"],
    bookingDeposit: 8000,
    verified: true
  }
];