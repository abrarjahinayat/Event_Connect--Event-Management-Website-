const { default: mongoose } = require("mongoose");

const signupSchema = new mongoose.Schema(
  {
    buisnessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },

    // 🎯 FIXED: Business Registration Number - NOT required by default
    // Will be validated conditionally in the controller based on service type
    businessRegistrationNumber: {
      type: String,
      unique: true,
      sparse: true, // 🎯 CRITICAL: Allows null/undefined values while maintaining uniqueness
      trim: true,
    },
    
    // Owner NID - Required for everyone
    ownerNationalId: {
      type: String,
      required: [true, "Owner NID is required"],
      trim: true,
    },

    // 🎯 FIXED: Verification Documents - NOT required by default
    verificationDocuments: {
      tradeLicense: {
        type: String,
        required: false, // 🎯 Changed from true to false
      },
      nidDocument: {
        type: String,
        required: [true, "NID document is required"], // This is required for everyone
      },
    },

    // Verification Status
    verificationStatus: {
      type: String,
      enum: ["Pending", "Under Review", "Verified", "Rejected"],
      default: "Pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    
    // Admin Rating
    adminRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    adminRatingComment: {
      type: String,
      default: ''
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    ratedAt: {
      type: Date
    },

    // Admin Review Details
    verification: {
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      reviewedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      rejectionReason: String,
      adminNotes: String,
    },

    // Verification Tracking
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    rejectedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    adminNotes: {
      type: String,
      default: ''
    },

    // OTP & Email Verification
    otp: {
      type: Number,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Signup", signupSchema);