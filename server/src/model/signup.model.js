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

    // ✅ NEW: Vendor Verification Fields
    businessRegistrationNumber: {
      type: String,
      required: [true, "Business registration number is required"],
      unique: true,
      trim: true,
    },
    ownerNationalId: {
      type: String,
      required: [true, "Owner NID is required"],
      trim: true,
    },

    // Verification Documents
    verificationDocuments: {
      tradeLicense: {
        type: String, // URL of uploaded file
        required: [true, "Trade license is required"],
      },
      nidDocument: {
        type: String, // URL of uploaded file
        required: [true, "NID document is required"],
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
    // Add to signup.model.js after existing fields
    adminRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },
      featured: {
        type: Boolean,
        default: false,
      },
      updatedAt: Date,
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

    // OTP & Email Verification (existing)
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
