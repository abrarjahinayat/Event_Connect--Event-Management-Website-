const { default: mongoose } = require("mongoose");

const vendorServicesSchema = new mongoose.Schema(
  {
    // Basic Information
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    aboutYourCompany: {
      type: String,
      required: [true, "About company is required"],
      minlength: [50, "About must be at least 50 characters"],
    },

    // 🎯 NEW: Profile Picture for Individual Service Providers
    // (Photographers, Cinematographers, Cooks & Caterers)
    profilePicture: {
      type: String,
      // Required only for individual service categories
    },

    // Location Information
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    fullAddress: {
      type: String,
    },

    // Images
    image: [
      {
        type: String,
        required: [true, "At least one image is required"],
      },
    ],
    images: [
      {
        type: String,
      },
    ],

    // Pricing
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Availability
    availability: {
      type: String,
      enum: ["Available", "Booked", "Unavailable"],
      default: "Available",
    },
    available: {
      type: Boolean,
      default: true,
    },

    // Rating & Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Specialties/Services (Array of strings)
    specialties: {
      type: [String],
      required: [true, "At least one specialty is required"],
    },

    // Features (Array of strings) - NOW REQUIRED
    features: {
      type: [String],
      required: [true, "At least one feature is required"],
      validate: {
        validator: function(v) {
          return v && v.length > 0 && v.some(f => f.trim() !== '');
        },
        message: 'At least one feature is required'
      }
    },

    // Services - Can be simple strings OR objects - NOW REQUIRED
    services: {
      type: [mongoose.Schema.Types.Mixed],
      required: [true, "At least one service is required"],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one service is required'
      }
    },

    // Pricing Packages - NOW REQUIRED
    packages: {
      type: [{
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        duration: {
          type: String,
        },
        description: {
          type: String,
        },
        features: {
          type: [String],
          required: true,
        },
        popular: {
          type: Boolean,
          default: false,
        },
      }],
      required: [true, "At least one package is required"],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one pricing package is required'
      }
    },

    // Portfolio Items
    portfolio: [
      {
        id: {
          type: Number,
        },
        title: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        category: {
          type: String,
        },
      },
    ],

    // Contact Information - NOW REQUIRED
    contact: {
      phone: {
        type: String,
        required: [true, "Contact phone is required"],
      },
      email: {
        type: String,
        required: [true, "Contact email is required"],
      },
      hours: {
        type: String,
        default: "9 AM - 6 PM, Mon-Sat",
      },
      website: {
        type: String,
      },
    },

    // Reviews
    reviews: [
      {
        id: { type: Number },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: { type: String, required: true },
        avatar: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        date: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Vendor Reference (who owns this service)
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },

    // Service Category (from vendor registration)
    serviceCategory: {
      type: String,
      required: [true, "Service category is required"],
      enum: [
        "Production Houses",
        "Community Centers",
        "Event Management",
        "Photographers",
        "Cinematographers",
        "Cooks & Caterers",
      ],
    },

    // Statistics
    totalBookings: {
      type: Number,
      default: 0,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: false
  }
);

// Index for faster queries
vendorServicesSchema.index({ slug: 1 });
vendorServicesSchema.index({ serviceCategory: 1 });
vendorServicesSchema.index({ location: 1 });
vendorServicesSchema.index({ availability: 1 });
vendorServicesSchema.index({ vendorId: 1 });

// Virtual for checking if available
vendorServicesSchema.virtual('isAvailable').get(function() {
  return this.availability === 'Available' && this.available === true;
});

// Virtual to check if this is an individual service provider
vendorServicesSchema.virtual('isIndividualProvider').get(function() {
  return ['Photographers', 'Cinematographers', 'Cooks & Caterers'].includes(this.serviceCategory);
});

module.exports = mongoose.model("VendorServices", vendorServicesSchema);