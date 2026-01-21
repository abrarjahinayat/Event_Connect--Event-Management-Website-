const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'super_admin'],
    },
    permissions: {
      canVerifyVendors: {
        type: Boolean,
        default: true,
      },
      canApproveBookings: {
        type: Boolean,
        default: true,
      },
      canManageUsers: {
        type: Boolean,
        default: true,
      },
      canViewAnalytics: {
        type: Boolean,
        default: true,
      },
      canManageSettings: {
        type: Boolean,
        default: false, // Only super_admin
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { 
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set super_admin permissions automatically
adminSchema.pre("save", function() {
  if (this.role === 'super_admin') {
    this.permissions = {
      canVerifyVendors: true,
      canApproveBookings: true,
      canManageUsers: true,
      canViewAnalytics: true,
      canManageSettings: true,
    };
  }
});

module.exports = mongoose.model("Admin", adminSchema);