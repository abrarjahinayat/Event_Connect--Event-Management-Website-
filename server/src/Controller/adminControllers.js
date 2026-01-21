const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../model/admin.model");
const signupModel = require("../model/signup.model");
const userSignupModel = require("../model/userSignup.model");
const bookingModel = require("../model/booking.model");
const vendorServicesModel = require("../model/vendor.services.model");

// ====================================
// ADMIN AUTHENTICATION
// ====================================

// @desc    Admin Login
// @route   POST /api/v1/admin/login
// @access  Public
const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin with password
    const admin = await adminModel.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found with this email"
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect"
      });
    }
    
    // Success
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.PRIVATE_KEY,
      { expiresIn: "24h" }
    );
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: { email: admin.email, name: admin.name, role: admin.role }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create Admin (Only super_admin can create)
// @route   POST /api/v1/admin/create
// @access  Private (Super Admin only)
const createAdminController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if admin exists
    const adminExists = await adminModel.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Create admin
    const admin = new adminModel({
      name,
      email,
      password,
      role: role || 'admin',
    });

    await admin.save();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: adminResponse,
    });

  } catch (error) {
    console.error("Create admin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ====================================
// VENDOR MANAGEMENT
// ====================================

// @desc    Get all vendors (with filters)
// @route   GET /api/v1/admin/vendors
// @access  Private (Admin)
const getAllVendorsController = async (req, res) => {
  try {
    const {
      verificationStatus,
      service,
      isVerified,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = {};

    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    if (service) {
      query.service = service;
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    // Execute query
    const vendors = await signupModel
      .find(query)
      .select('-password -otp')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOptions);

    const total = await signupModel.countDocuments(query);

    // Get statistics
    const stats = {
      total: await signupModel.countDocuments(),
      pending: await signupModel.countDocuments({ verificationStatus: 'Pending' }),
      underReview: await signupModel.countDocuments({ verificationStatus: 'Under Review' }),
      verified: await signupModel.countDocuments({ verificationStatus: 'Verified' }),
      rejected: await signupModel.countDocuments({ verificationStatus: 'Rejected' }),
    };

    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully",
      count: vendors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats,
      data: vendors,
    });

  } catch (error) {
    console.error("Get vendors error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Verify/Approve Vendor
// @route   PUT /api/v1/admin/vendors/:vendorId/verify
// @access  Private (Admin)
const verifyVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { approved, rejectionReason, adminNotes, adminId } = req.body;

    const vendor = await signupModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (approved) {
      // Approve vendor
      vendor.verificationStatus = 'Verified';
      vendor.isVerified = true;
      vendor.verification.reviewedAt = new Date();
      vendor.verification.reviewedBy = adminId;
      vendor.verification.adminNotes = adminNotes || '';

      await vendor.save();

      // TODO: Send approval email to vendor

      return res.status(200).json({
        success: true,
        message: "Vendor verified successfully",
        data: vendor,
      });
    } else {
      // Reject vendor
      vendor.verificationStatus = 'Rejected';
      vendor.isVerified = false;
      vendor.verification.reviewedAt = new Date();
      vendor.verification.reviewedBy = adminId;
      vendor.verification.rejectionReason = rejectionReason || 'Not specified';
      vendor.verification.adminNotes = adminNotes || '';

      await vendor.save();

      // TODO: Send rejection email to vendor

      return res.status(200).json({
        success: true,
        message: "Vendor verification rejected",
        data: vendor,
      });
    }

  } catch (error) {
    console.error("Verify vendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Rate Vendor (for listing priority)
// @route   PUT /api/v1/admin/vendors/:vendorId/rate
// @access  Private (Admin)
const rateVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rating, featured } = req.body; // rating: 1-5, featured: boolean

    const vendor = await signupModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Add admin rating field if doesn't exist
    if (!vendor.adminRating) {
      vendor.adminRating = {};
    }

    if (rating !== undefined) {
      vendor.adminRating.rating = rating;
    }

    if (featured !== undefined) {
      vendor.adminRating.featured = featured;
    }

    vendor.adminRating.updatedAt = new Date();

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor rating updated successfully",
      data: vendor,
    });

  } catch (error) {
    console.error("Rate vendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ====================================
// USER MANAGEMENT
// ====================================

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
// 🔧 REPLACE your getAllUsersController with this updated version:

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getAllUsersController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const users = await userSignupModel
      .find()
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOptions);

    const total = await userSignupModel.countDocuments();

    // 🔧 FIX: Calculate stats properly
    const stats = {
      totalUsers: total,
      verifiedEmails: await userSignupModel.countDocuments({ isEmailVerified: true }),
      activeToday: await userSignupModel.countDocuments({
        updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
    };

    // 🔧 FIX: Get booking counts for each user
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await bookingModel.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats, // 🔧 FIX: Now stats is always returned
      data: usersWithBookings,
    });

  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ====================================
// BOOKING MANAGEMENT
// ====================================

// @desc    Get all bookings
// @route   GET /api/v1/admin/bookings
// @access  Private (Admin)
const getAllBookingsController = async (req, res) => {
  try {
    const {
      bookingStatus,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (bookingStatus) {
      query.bookingStatus = bookingStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const bookings = await bookingModel
      .find(query)
      .populate('user', 'name email phone')
      .populate('service', 'companyName serviceCategory location')
      .populate('vendor', 'buisnessName email phone')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOptions);

    const total = await bookingModel.countDocuments(query);

    // Get statistics
    const stats = {
      total: await bookingModel.countDocuments(),
      pending: await bookingModel.countDocuments({ bookingStatus: 'pending' }),
      approved: await bookingModel.countDocuments({ bookingStatus: 'approved' }),
      paymentCompleted: await bookingModel.countDocuments({ bookingStatus: 'payment_completed' }),
      confirmed: await bookingModel.countDocuments({ bookingStatus: 'confirmed' }),
      completed: await bookingModel.countDocuments({ bookingStatus: 'completed' }),
      cancelled: await bookingModel.countDocuments({ bookingStatus: 'cancelled' }),
      rejected: await bookingModel.countDocuments({ bookingStatus: 'rejected' }),
    };

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats,
      data: bookings,
    });

  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get pending bookings (needs approval)
// @route   GET /api/v1/admin/bookings/pending
// @access  Private (Admin)
const getPendingBookingsController = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ bookingStatus: 'pending' })
      .populate('user', 'name email phone')
      .populate('service', 'companyName serviceCategory location image')
      .populate('vendor', 'buisnessName email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pending bookings fetched successfully",
      count: bookings.length,
      data: bookings,
    });

  } catch (error) {
    console.error("Get pending bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ====================================
// DASHBOARD ANALYTICS
// ====================================

// @desc    Get admin dashboard analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin)
const getAnalyticsController = async (req, res) => {
  try {
    // Get counts
    const totalVendors = await signupModel.countDocuments();
    const totalUsers = await userSignupModel.countDocuments();
    const totalBookings = await bookingModel.countDocuments();
    const totalServices = await vendorServicesModel.countDocuments();

    // Vendor stats
    const pendingVendors = await signupModel.countDocuments({ verificationStatus: 'Pending' });
    const verifiedVendors = await signupModel.countDocuments({ verificationStatus: 'Verified' });

    // Booking stats
    const pendingBookings = await bookingModel.countDocuments({ bookingStatus: 'pending' });
    const completedBookings = await bookingModel.countDocuments({ bookingStatus: 'completed' });

    // Revenue calculation (total from completed bookings)
    const revenueData = await bookingModel.aggregate([
      { $match: { 'payment.advancePaid': true } },
      { $group: { _id: null, totalRevenue: { $sum: '$advancePayment' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Recent activities (last 10 bookings)
    const recentBookings = await bookingModel
      .find()
      .populate('user', 'name')
      .populate('service', 'companyName')
      .sort({ createdAt: -1 })
      .limit(10);

    // Service category distribution
    const serviceCategoryStats = await vendorServicesModel.aggregate([
      { $group: { _id: '$serviceCategory', count: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        overview: {
          totalVendors,
          totalUsers,
          totalBookings,
          totalServices,
          totalRevenue,
        },
        vendors: {
          total: totalVendors,
          pending: pendingVendors,
          verified: verifiedVendors,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          completed: completedBookings,
        },
        recentBookings,
        serviceCategoryStats,
      },
    });

  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ====================================
// 🆕 ADD THESE FUNCTIONS TO YOUR EXISTING adminControllers.js
// ====================================
// Add after your existing getAllUsersController

// @desc    Get single user details with bookings
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin)
const getUserDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userSignupModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's bookings
    const bookings = await bookingModel
      .find({ user: id })
      .populate("service", "companyName serviceCategory")
      .populate("vendor", "buisnessName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: {
        user,
        bookings,
        bookingStats: {
          total: bookings.length,
          completed: bookings.filter(b => b.bookingStatus === "completed").length,
          cancelled: bookings.filter(b => b.bookingStatus === "cancelled").length,
          pending: bookings.filter(b => b.bookingStatus === "pending").length,
        },
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userSignupModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has active bookings
    const activeBookings = await bookingModel.countDocuments({
      user: id,
      bookingStatus: { $in: ["pending", "approved", "payment_completed", "confirmed", "in_progress"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user. User has ${activeBookings} active booking(s)`,
      });
    }

    // Delete user
    await userSignupModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// ====================================
// 🆕 VENDOR MANAGEMENT - ADDITIONAL FUNCTIONS
// ====================================
// Add after your existing getAllVendorsController

// @desc    Get single vendor details with services and bookings
// @route   GET /api/v1/admin/vendors/:id
// @access  Private (Admin)
const getVendorDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await signupModel.findById(id).select("-password -otp");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get vendor's services
    const services = await vendorServicesModel
      .find({ vendorId: id })
      .sort({ createdAt: -1 });

    // Get vendor's bookings
    const bookings = await bookingModel
      .find({ vendor: id })
      .populate("user", "name email phone")
      .populate("service", "companyName serviceCategory")
      .sort({ createdAt: -1 });

    // Calculate revenue
    const revenue = {
      total: 0,
      advance: 0,
      remaining: 0,
    };

    bookings.forEach(booking => {
      if (booking.payment?.advancePaid) {
        revenue.advance += booking.advancePayment || 0;
        revenue.total += booking.advancePayment || 0;
      }
      if (booking.payment?.remainingPaid) {
        revenue.remaining += booking.remainingPayment || 0;
        revenue.total += booking.remainingPayment || 0;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      data: {
        vendor,
        services,
        bookings,
        stats: {
          totalServices: services.length,
          activeServices: services.filter(s => s.isActive).length,
          totalBookings: bookings.length,
          completedBookings: bookings.filter(b => b.bookingStatus === "completed").length,
          revenue,
        },
      },
    });
  } catch (error) {
    console.error("Get vendor details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Delete vendor and all associated services
// @route   DELETE /api/v1/admin/vendors/:id
// @access  Private (Admin)
const deleteVendorController = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await signupModel.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Check for active bookings
    const activeBookings = await bookingModel.countDocuments({
      vendor: id,
      bookingStatus: { $in: ["pending", "approved", "payment_completed", "confirmed", "in_progress"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete vendor. Vendor has ${activeBookings} active booking(s)`,
      });
    }

    // Delete vendor's services
    await vendorServicesModel.deleteMany({ vendorId: id });

    // Delete vendor
    await signupModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Vendor and associated services deleted successfully",
    });
  } catch (error) {
    console.error("Delete vendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Delete vendor service
// @route   DELETE /api/v1/admin/vendors/:vendorId/services/:serviceId
// @access  Private (Admin)
const deleteVendorServiceController = async (req, res) => {
  try {
    const { vendorId, serviceId } = req.params;

    const service = await vendorServicesModel.findOne({
      _id: serviceId,
      vendorId: vendorId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check for active bookings
    const activeBookings = await bookingModel.countDocuments({
      service: serviceId,
      bookingStatus: { $in: ["pending", "approved", "payment_completed", "confirmed", "in_progress"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete service. Service has ${activeBookings} active booking(s)`,
      });
    }

    await vendorServicesModel.findByIdAndDelete(serviceId);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete vendor service error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// ====================================
// 🆕 BOOKING MANAGEMENT - ADDITIONAL FUNCTIONS
// ====================================
// Add after your existing getPendingBookingsController

// @desc    Approve or reject booking
// @route   PUT /api/v1/admin/bookings/:id/approve
// @access  Private (Admin)
const approveRejectBookingController = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason, adminNotes, adminId } = req.body;

    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Valid action (approve/reject) is required",
      });
    }

    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (action === "approve") {
      booking.bookingStatus = "approved";
      booking.adminApproval = {
        approved: true,
        approvedBy: adminId,
        approvedAt: new Date(),
        adminNotes: adminNotes || "",
      };
    } else {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      booking.bookingStatus = "rejected";
      booking.adminApproval = {
        approved: false,
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason,
        adminNotes: adminNotes || "",
      };
    }

    await booking.save();

    // TODO: Send email notification to user

    return res.status(200).json({
      success: true,
      message: `Booking ${action === "approve" ? "approved" : "rejected"} successfully`,
      data: booking,
    });
  } catch (error) {
    console.error("Approve/reject booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

module.exports = {
  // Authentication
  adminLoginController,
  createAdminController,
  
  // Vendor Management
  getAllVendorsController,
  getVendorDetailsController,        // 🆕 NEW
  verifyVendorController,
  deleteVendorController,            // 🆕 NEW
  deleteVendorServiceController,     // 🆕 NEW
  rateVendorController,
  
  // User Management
  getAllUsersController,
  getUserDetailsController,          // 🆕 NEW
  deleteUserController,              // 🆕 NEW
  
  // Booking Management
  getAllBookingsController,
  getPendingBookingsController,
  approveRejectBookingController,    // 🆕 NEW
  
  // Analytics
  getAnalyticsController,
};