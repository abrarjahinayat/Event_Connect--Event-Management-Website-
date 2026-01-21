const { default: mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // User Information
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    
    // Service Information
    service: {
      type: mongoose.Types.ObjectId,
      ref: "VendorServices",
      required: [true, "Service ID is required"],
    },
    
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "Signup",
      required: [true, "Vendor ID is required"],
    },

    // Customer Details
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
    },

    // Event Details
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventAddress: {
      type: String,
      required: [true, "Event address is required"],
    },
    eventCity: {
      type: String,
      required: [true, "Event city is required"],
    },
    
    // Package Selection
    selectedPackage: {
      name: {
        type: String,
        required: [true, "Package name is required"],
      },
      price: {
        type: Number,
        required: [true, "Package price is required"],
      },
      features: [String],
    },

    // Additional Information
    specialRequests: {
      type: String,
      default: "",
    },

    // Pricing
    packagePrice: {
      type: Number,
      required: [true, "Package price is required"],
    },
    advancePayment: {
      type: Number,
      required: [true, "Advance payment is required"],
    }, // 10% of package price
    remainingPayment: {
      type: Number,
      required: [true, "Remaining payment is required"],
    }, // 90% of package price
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },

    // Booking Status Workflow
    bookingStatus: {
      type: String,
      enum: [
        "pending", // Initial request
        "admin_reviewing", // Admin is reviewing
        "approved", // Admin approved, waiting for payment
        "payment_pending", // Payment initiated
        "payment_completed", // Advance paid
        "confirmed", // Booking confirmed after payment
        "vendor_contacted", // Vendor contact shared with user
        "in_progress", // Event ongoing
        "completed", // Event completed
        "cancelled", // Cancelled by user/admin
        "rejected", // Rejected by admin
      ],
      default: "pending",
    },

    // Admin Actions
    adminApproval: {
      approved: {
        type: Boolean,
        default: false,
      },
      approvedBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
      },
      approvedAt: Date,
      rejectionReason: String,
      adminNotes: String,
    },

    // Payment Information
    payment: {
      transactionId: String,
      paymentMethod: {
        type: String,
        enum: ["sslcommerz", "cod"],
        default: "sslcommerz",
      },
      advancePaid: {
        type: Boolean,
        default: false,
      },
      advancePaidAt: Date,
      remainingPaid: {
        type: Boolean,
        default: false,
      },
      remainingPaidAt: Date,
      paymentStatus: {
        type: String,
        enum: ["unpaid", "advance_paid", "fully_paid", "refunded"],
        default: "unpaid",
      },
    },

    // Vendor Contact (Only shown after payment)
    vendorContactShared: {
      type: Boolean,
      default: false,
    },

    // Cancellation
    cancellation: {
      cancelled: {
        type: Boolean,
        default: false,
      },
      cancelledBy: String, // 'user' or 'admin'
      cancelledAt: Date,
      cancellationReason: String,
      refundProcessed: {
        type: Boolean,
        default: false,
      },
      refundAmount: Number,
    },

    // Timestamps for tracking
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ user: 1, bookingStatus: 1 });
bookingSchema.index({ vendor: 1, bookingStatus: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ eventDate: 1 });

// Virtual for checking if contact can be shared
bookingSchema.virtual("canShareContact").get(function () {
  return (
    this.bookingStatus === "payment_completed" ||
    this.bookingStatus === "confirmed" ||
    this.bookingStatus === "vendor_contacted"
  );
});

module.exports = mongoose.model("Booking", bookingSchema);