// File: src/app/production-houses/data.js

export const productionHousesData = [
  {
    id: 1,
    name: "Dhaka Film Studio",
    tagline: "Bangladesh's Premier Production House",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&h=600&fit=crop",
    location: "Gulshan, Dhaka",
    fullAddress: "House 45, Road 11, Gulshan-1, Dhaka 1212, Bangladesh",
    startingPrice: 50000,
    available: true,
    rating: 4.9,
    reviewCount: 156,
    specialties: ["TVC", "Drama", "Music Videos"],
    images: [
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=1200&h=700&fit=crop"
    ],
    about: "Dhaka Film Studio is Bangladesh's leading production house with state-of-the-art facilities. We specialize in TVCs, web series, dramas, and music videos. With over 10 years of experience serving top brands like Grameenphone, Robi, and Unilever Bangladesh, we deliver world-class production quality.",
    features: [
      "4,500 sq ft air-conditioned studio",
      "Green screen and chroma key setup",
      "4K RED camera equipment",
      "Professional lighting grid system",
      "Makeup and costume rooms",
      "Client viewing lounge",
      "Ample parking space",
      "Generator backup",
      "High-speed WiFi",
      "Food & beverage service"
    ],
    services: [
      { icon: "Camera", title: "TVC Production", description: "Complete TV commercial production for brands" },
      { icon: "Video", title: "Drama & Web Series", description: "Full-length drama and OTT content production" },
      { icon: "Mic", title: "Audio Production", description: "Professional dubbing and sound design" },
      { icon: "Lightbulb", title: "Creative Services", description: "Script writing, direction, and post-production" }
    ],
    packages: [
      {
        name: "Basic Package",
        price: 50000,
        duration: "Half Day (6 hours)",
        features: [
          "Studio space rental",
          "Basic lighting setup",
          "1 camera with operator",
          "Basic editing (2 revisions)",
          "Sound recording equipment"
        ],
        popular: false
      },
      {
        name: "Professional Package",
        price: 120000,
        duration: "Full Day (12 hours)",
        features: [
          "Complete studio access",
          "Advanced lighting setup",
          "2 cameras with operators",
          "Professional editing suite",
          "Color grading included",
          "Makeup artist & assistant",
          "Lunch & refreshments",
          "Props & set decoration"
        ],
        popular: true
      },
      {
        name: "Premium Package",
        price: 300000,
        duration: "3 Days Shoot",
        features: [
          "Exclusive studio booking",
          "Full production crew (15+ members)",
          "Multi-camera setup (4 cameras)",
          "Complete post-production",
          "VFX & motion graphics",
          "Drone cinematography",
          "Celebrity management support",
          "Full catering service",
          "Dedicated project manager"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop", title: "Grameenphone TVC" },
      { id: 2, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop", title: "Music Video" },
      { id: 3, image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&h=600&fit=crop", title: "Drama Serial" },
      { id: 4, image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop", title: "Fashion Shoot" },
      { id: 5, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop", title: "Documentary" },
      { id: 6, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", title: "Web Series" }
    ],
    reviews: [
      {
        id: 1,
        name: "Fahim Ahmed",
        rating: 5,
        date: "2 weeks ago",
        comment: "Outstanding production house! We shot our Eid TVC here and the quality was exceptional. The team is very professional and accommodating. Highly recommended for any brand in Bangladesh.",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      {
        id: 2,
        name: "Nusrat Jahan",
        rating: 5,
        date: "1 month ago",
        comment: "Best studio in Dhaka! Shot our music video here and the facilities are world-class. The lighting setup and camera equipment are top-notch. Will definitely come back.",
        avatar: "https://i.pravatar.cc/150?img=23"
      },
      {
        id: 3,
        name: "Rafiq Hassan",
        rating: 4,
        date: "2 months ago",
        comment: "Great experience overall. Professional crew and excellent post-production work. The only issue was slight delay on day one but they compensated with extra editing time.",
        avatar: "https://i.pravatar.cc/150?img=33"
      }
    ],
    contact: {
     
      hours: "Sat-Thu: 9:00 AM - 9:00 PM, Fri: Closed"
    }
  },
  {
    id: 2,
    name: "Banani Media House",
    tagline: "Creative Excellence in Every Frame",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop",
    location: "Banani, Dhaka",
    fullAddress: "Plot 27, Road 17, Block C, Banani, Dhaka 1213, Bangladesh",
    startingPrice: 75000,
    available: true,
    rating: 4.7,
    reviewCount: 98,
    specialties: ["Web Series", "OTT Content", "Digital Ads"],
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=1200&h=700&fit=crop"
    ],
    about: "Banani Media House specializes in creating content for digital platforms and OTT services. We've produced hit web series for Hoichoi, Chorki, and Binge. Our modern facility is equipped with the latest technology to deliver cinematic quality productions.",
    features: [
      "3,000 sq ft modern studio",
      "4K & 6K camera packages",
      "Dolby Atmos sound system",
      "Professional editing suites (DaVinci Resolve)",
      "Green screen with motion tracking",
      "Makeup and green room",
      "Conference room for client meetings",
      "24/7 security with CCTV",
      "Free WiFi and parking"
    ],
    services: [
      { icon: "Camera", title: "OTT Productions", description: "Web series and films for streaming platforms" },
      { icon: "Video", title: "Digital Marketing", description: "Social media content and digital ads" },
      { icon: "Mic", title: "Post-Production", description: "Editing, VFX, color grading, and sound design" },
      { icon: "Lightbulb", title: "Content Strategy", description: "Creative development and script writing" }
    ],
    packages: [
      {
        name: "Digital Content",
        price: 75000,
        duration: "Full Day (10 hours)",
        features: [
          "Studio rental",
          "2 camera setup",
          "Basic lighting",
          "Sound recording",
          "Basic editing (3 revisions)",
          "Social media optimization"
        ],
        popular: false
      },
      {
        name: "Web Series Package",
        price: 180000,
        duration: "2 Days Shoot",
        features: [
          "Complete studio access",
          "Multi-camera setup (3 cameras)",
          "Professional lighting grid",
          "Full crew (12 members)",
          "Advanced editing & color grading",
          "Sound design & mixing",
          "VFX support",
          "Makeup artist team",
          "Catering included"
        ],
        popular: true
      },
      {
        name: "Premium OTT",
        price: 500000,
        duration: "1 Week Production",
        features: [
          "Exclusive studio booking",
          "Cinema-grade equipment",
          "Complete production crew (20+ members)",
          "Celebrity & artist management",
          "Full post-production pipeline",
          "VFX & CGI integration",
          "Music composition",
          "DCP & OTT delivery formats",
          "Marketing material creation"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", title: "Hoichoi Web Series" },
      { id: 2, image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop", title: "Digital Campaign" },
      { id: 3, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop", title: "Short Film" }
    ],
    reviews: [
      {
        id: 1,
        name: "Tahmina Akter",
        rating: 5,
        date: "1 week ago",
        comment: "Amazing experience! We produced our web series here for Chorki. The post-production quality is unmatched in Dhaka. Highly professional team.",
        avatar: "https://i.pravatar.cc/150?img=45"
      },
      {
        id: 2,
        name: "Imran Khan",
        rating: 4,
        date: "3 weeks ago",
        comment: "Good studio with modern equipment. The editing team is very skilled. Would have given 5 stars but the parking was a bit tight during peak hours.",
        avatar: "https://i.pravatar.cc/150?img=12"
      }
    ],
    contact: {
    //   phone: "+880 1825-987654",
    //   email: "contact@bananimedia.bd",
      hours: "Sat-Thu: 10:00 AM - 8:00 PM, Fri: Closed"
    }
  },
  {
    id: 3,
    name: "Dhanmondi Creative Studio",
    tagline: "Affordable Quality for Independent Creators",
    image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&h=600&fit=crop",
    location: "Dhanmondi, Dhaka",
    fullAddress: "House 23/A, Road 3, Dhanmondi, Dhaka 1205, Bangladesh",
    startingPrice: 25000,
    available: false,
    rating: 4.5,
    reviewCount: 134,
    specialties: ["YouTube Content", "Music Videos", "Short Films"],
    images: [
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=1200&h=700&fit=crop"
    ],
    about: "Dhanmondi Creative Studio is the perfect choice for independent filmmakers, YouTubers, and small businesses. We offer affordable rates without compromising on quality. Our team has helped launch dozens of successful YouTube channels and music videos.",
    features: [
      "2,000 sq ft compact studio",
      "Green screen setup",
      "DSLR & mirrorless camera packages",
      "LED lighting panels",
      "Teleprompter available",
      "Audio recording booth",
      "Editing workstations (Adobe Suite)",
      "Free WiFi",
      "Affordable rates for students"
    ],
    services: [
      { icon: "Camera", title: "YouTube Production", description: "Complete video production for content creators" },
      { icon: "Video", title: "Music Videos", description: "Budget-friendly music video production" },
      { icon: "Mic", title: "Voice Recording", description: "Professional voiceover and dubbing services" },
      { icon: "Lightbulb", title: "Video Editing", description: "Affordable editing and color correction" }
    ],
    packages: [
      {
        name: "Starter Package",
        price: 25000,
        duration: "Half Day (5 hours)",
        features: [
          "Studio space",
          "1 camera with operator",
          "Basic lighting",
          "Simple editing",
          "Audio recording"
        ],
        popular: false
      },
      {
        name: "Content Creator",
        price: 45000,
        duration: "Full Day (8 hours)",
        features: [
          "Studio rental",
          "2 camera setup",
          "Professional lighting",
          "Teleprompter",
          "Advanced editing (5 revisions)",
          "Thumbnail design",
          "YouTube optimization"
        ],
        popular: true
      },
      {
        name: "Music Video Package",
        price: 85000,
        duration: "2 Days",
        features: [
          "Studio & outdoor shoot",
          "3 camera angles",
          "Creative direction",
          "Dancers & extras coordination",
          "Editing with effects",
          "Color grading",
          "YouTube upload & promotion"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop", title: "Music Video" },
      { id: 2, image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&h=600&fit=crop", title: "YouTube Channel" },
      { id: 3, image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop", title: "Short Film" }
    ],
    reviews: [
      {
        id: 1,
        name: "Shakib Rahman",
        rating: 5,
        date: "1 month ago",
        comment: "Perfect for YouTubers and independent creators! Very affordable and the quality is great. The team helped me a lot with my first music video.",
        avatar: "https://i.pravatar.cc/150?img=51"
      },
      {
        id: 2,
        name: "Anika Islam",
        rating: 4,
        date: "6 weeks ago",
        comment: "Good studio for the price. Great for small projects and YouTube content. The staff is very helpful and understanding of budget constraints.",
        avatar: "https://i.pravatar.cc/150?img=26"
      }
    ],
    contact: {
    //   phone: "+880 1934-567890",
    //   email: "hello@dhanmondistudio.com",
      hours: "Sat-Thu: 11:00 AM - 7:00 PM, Fri: 2:00 PM - 7:00 PM"
    }
  },
  {
    id: 4,
    name: "Uttara Production Complex",
    tagline: "North Dhaka's Largest Studio Facility",
    image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800&h=600&fit=crop",
    location: "Uttara, Dhaka",
    fullAddress: "Sector 7, Plot 15, Uttara Model Town, Dhaka 1230, Bangladesh",
    startingPrice: 60000,
    available: true,
    rating: 4.8,
    reviewCount: 87,
    specialties: ["TV Drama", "Reality Shows", "Corporate Videos"],
    images: [
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=700&fit=crop"
    ],
    about: "Uttara Production Complex is North Dhaka's premier production facility serving TV channels, corporate clients, and event organizers. With 6,000 sq ft of studio space and outdoor areas, we handle large-scale productions with ease.",
    features: [
      "6,000 sq ft main studio floor",
      "Outdoor shooting area",
      "Multiple sets can run simultaneously",
      "Broadcast-quality equipment",
      "Live streaming capability",
      "Large parking for 30+ vehicles",
      "Canteen & rest areas",
      "Air-conditioned throughout",
      "Backup power supply"
    ],
    services: [
      { icon: "Camera", title: "TV Production", description: "Multi-camera TV drama and show production" },
      { icon: "Video", title: "Corporate Videos", description: "Professional corporate and training videos" },
      { icon: "Mic", title: "Event Coverage", description: "Live event recording and streaming" },
      { icon: "Lightbulb", title: "Production Management", description: "Complete production coordination services" }
    ],
    packages: [
      {
        name: "Corporate Package",
        price: 60000,
        duration: "Full Day (8 hours)",
        features: [
          "Studio rental",
          "Corporate setup",
          "2 camera angles",
          "Professional lighting",
          "Editing & delivery",
          "Script consultation"
        ],
        popular: false
      },
      {
        name: "TV Drama Package",
        price: 150000,
        duration: "2 Days Shoot",
        features: [
          "Main studio floor",
          "Multi-camera setup (4 cameras)",
          "TV crew (15 members)",
          "Set decoration",
          "Professional editing",
          "Sound design",
          "Catering for cast & crew",
          "Makeup & wardrobe team"
        ],
        popular: true
      },
      {
        name: "Reality Show Package",
        price: 400000,
        duration: "1 Week Production",
        features: [
          "Exclusive studio booking",
          "Live audience setup",
          "Multiple camera angles (6+ cameras)",
          "Live streaming support",
          "Complete production crew",
          "Celebrity coordination",
          "Full post-production",
          "Promotional content creation",
          "Audience management"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", title: "TV Drama Serial" },
      { id: 2, image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop", title: "Corporate Video" },
      { id: 3, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop", title: "Reality Show" }
    ],
    reviews: [
      {
        id: 1,
        name: "Mahbub Alam",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent facility for TV productions. We shot our drama serial here and the space was perfect. Professional crew and great management.",
        avatar: "https://i.pravatar.cc/150?img=60"
      }
    ],
    contact: {
    //   phone: "+880 1678-234567",
    //   email: "booking@uttaraproduction.com",
      hours: "Sat-Thu: 8:00 AM - 10:00 PM, Fri: Closed"
    }
  },
  {
    id: 5,
    name: "Mirpur Digital Studios",
    tagline: "Pioneering Digital Content in Bangladesh",
    image: "https://images.unsplash.com/photo-1594656209149-129a85e9d284?w=800&h=600&fit=crop",
    location: "Mirpur, Dhaka",
    fullAddress: "Section 12, Road 7, Mirpur, Dhaka 1216, Bangladesh",
    startingPrice: 40000,
    available: true,
    rating: 4.6,
    reviewCount: 112,
    specialties: ["Animation", "VFX", "Gaming Content"],
    images: [
      "https://images.unsplash.com/photo-1594656209149-129a85e9d284?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=1200&h=700&fit=crop"
    ],
    about: "Mirpur Digital Studios specializes in animation, VFX, and digital content creation. We're Bangladesh's first studio focused on gaming content and live streaming production. Our facility includes motion capture and virtual production capabilities.",
    features: [
      "3,500 sq ft digital studio",
      "Green screen with virtual sets",
      "Motion capture equipment",
      "Gaming streaming setup",
      "High-end rendering farm",
      "VFX workstations",
      "3D animation suite",
      "Live streaming capability",
      "High-speed internet (1 Gbps)"
    ],
    services: [
      { icon: "Camera", title: "Animation Production", description: "2D & 3D animation for all platforms" },
      { icon: "Video", title: "VFX & CGI", description: "Visual effects and CGI integration" },
      { icon: "Mic", title: "Gaming Content", description: "Esports and gaming video production" },
      { icon: "Lightbulb", title: "Live Streaming", description: "Professional live stream production" }
    ],
    packages: [
      {
        name: "Streaming Package",
        price: 40000,
        duration: "Full Day (8 hours)",
        features: [
          "Streaming setup",
          "Multi-camera angles",
          "Graphics overlay",
          "Technical support",
          "High-speed internet"
        ],
        popular: false
      },
      {
        name: "VFX Production",
        price: 95000,
        duration: "Per Project",
        features: [
          "VFX consultation",
          "Green screen shoot",
          "CGI integration",
          "Compositing",
          "Rendering support",
          "Revisions included"
        ],
        popular: true
      },
      {
        name: "Animation Package",
        price: 250000,
        duration: "Per Minute (animated)",
        features: [
          "Concept development",
          "Storyboarding",
          "3D modeling & rigging",
          "Animation",
          "Rendering",
          "Sound design",
          "Final delivery in multiple formats"
        ],
        popular: false
      }
    ],
    portfolio: [
      { id: 1, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop", title: "Gaming Content" },
      { id: 2, image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&h=600&fit=crop", title: "3D Animation" },
      { id: 3, image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop", title: "VFX Project" }
    ],
    reviews: [
      {
        id: 1,
        name: "Ratul Hassan",
        rating: 5,
        date: "1 week ago",
        comment: "Best VFX studio in Bangladesh! They handled our TVC VFX work perfectly. The team is technically very strong and creative.",
        avatar: "https://i.pravatar.cc/150?img=70"
      }
    ],
    contact: {
    //   phone: "+880 1556-789012",
    //   email: "info@mirpurdigital.com",
      hours: "Sat-Thu: 9:00 AM - 9:00 PM, Fri: Closed"
    }
  }
];