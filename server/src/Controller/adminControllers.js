const Admin = require("../model/admin.model");
const Signup = require("../model/signup.model");
const User = require("../model/userSignup.model");
const vendorServicesModel = require("../model/vendor.services.model");
const Booking = require("../model/booking.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ====================================
// ADMIN AUTHENTICATION
// ====================================

const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated"
      });
    }

    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const adminData = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    };

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: adminData
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const createAdminController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists"
      });
    }

    const admin = new Admin({
      name,
      email,
      password,
      role: role || 'admin'
    });

    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ====================================
// VENDOR MANAGEMENT
// ====================================

const getAllVendorsController = async (req, res) => {
  try {
    const vendors = await Signup.find({}).sort({ createdAt: -1 });

    // Get service count for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const serviceCount = await vendorServicesModel.countDocuments({ vendorId: vendor._id });
        const bookingCount = await Booking.countDocuments({ vendor: vendor._id }); // 🎯 FIXED: vendor not vendorId
        
        return {
          ...vendor.toObject(),
          serviceCount,
          bookingCount
        };
      })
    );

    // Calculate stats
    const stats = {
      totalVendors: vendors.length,
      verified: vendors.filter(v => v.verificationStatus === 'Verified').length,
      pending: vendors.filter(v => v.verificationStatus === 'Pending').length,
      underReview: vendors.filter(v => v.verificationStatus === 'Under Review').length,
      rejected: vendors.filter(v => v.verificationStatus === 'Rejected').length
    };

    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully",
      data: vendorsWithStats,
      stats
    });
  } catch (error) {
    console.error("Get vendors error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getVendorDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Signup.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    const services = await vendorServicesModel.find({ vendorId: id });
    const bookings = await Booking.find({ vendor: id }); // 🎯 FIXED: vendor not vendorId

    const completedBookings = bookings.filter(b => b.bookingStatus === 'completed').length;
    const totalRevenue = bookings
      .filter(b => b.payment?.advancePaid || b.payment?.remainingPaid)
      .reduce((sum, b) => {
        let amount = 0;
        if (b.payment?.advancePaid) amount += b.advancePayment || 0;
        if (b.payment?.remainingPaid) amount += b.remainingPayment || 0;
        return sum + amount;
      }, 0);

    const stats = {
      totalServices: services.length,
      totalBookings: bookings.length,
      completedBookings,
      revenue: {
        total: totalRevenue,
        advance: bookings.reduce((sum, b) => sum + (b.payment?.advancePaid ? b.advancePayment || 0 : 0), 0),
        remaining: bookings.reduce((sum, b) => sum + (b.payment?.remainingPaid ? b.remainingPayment || 0 : 0), 0)
      }
    };

    return res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      data: {
        vendor,
        services,
        stats
      }
    });
  } catch (error) {
    console.error("Get vendor details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// 🎯 FIXED: Vendor Verification Controller
const verifyVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { action, rejectionReason, adminNotes, adminId } = req.body;

    console.log('🔍 Verification request:', { vendorId, action, rejectionReason });

    if (!action || !['approve', 'reject', 'review'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Valid action is required (approve, reject, or review)"
      });
    }

    if (action === 'reject' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const vendor = await Signup.findById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // 🎯 FIX: Update verification status based on action
    if (action === 'approve') {
      vendor.verificationStatus = 'Verified';
      vendor.isVerified = true;
      vendor.verifiedAt = new Date();
      vendor.verifiedBy = adminId;
      console.log('✅ Setting vendor to Verified');
    } else if (action === 'reject') {
      vendor.verificationStatus = 'Rejected';
      vendor.isVerified = false;
      vendor.rejectionReason = rejectionReason;
      vendor.rejectedAt = new Date();
      vendor.rejectedBy = adminId;
      console.log('❌ Setting vendor to Rejected');
    } else if (action === 'review') {
      vendor.verificationStatus = 'Under Review';
      vendor.isVerified = false;
      console.log('🔄 Setting vendor to Under Review');
    }

    if (adminNotes) {
      vendor.adminNotes = adminNotes;
    }

    await vendor.save();

    console.log('💾 Vendor saved with status:', vendor.verificationStatus);

    // 🎯 Update all vendor's services with verified status
    if (action === 'approve') {
      await vendorServicesModel.updateMany(
        { vendorId: vendor._id },
        { isVerified: true }
      );
      console.log('✅ Updated all services to verified');
    }

    return res.status(200).json({
      success: true,
      message: `Vendor ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'moved to review'} successfully`,
      data: vendor
    });
  } catch (error) {
    console.error("❌ Verify vendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// 🆕 NEW: Rate Vendor Controller
const rateVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rating, ratingComment, adminId } = req.body;

    console.log('⭐ Rating request:', { vendorId, rating, ratingComment });

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5"
      });
    }

    const vendor = await Signup.findById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Update vendor rating
    vendor.adminRating = rating;
    vendor.adminRatingComment = ratingComment || '';
    vendor.ratedBy = adminId;
    vendor.ratedAt = new Date();

    await vendor.save();

    console.log('✅ Vendor rated successfully');

    // Update all vendor's services with admin rating
    await vendorServicesModel.updateMany(
      { vendorId: vendor._id },
      { adminRating: rating }
    );

    console.log('✅ Updated all services with admin rating');

    return res.status(200).json({
      success: true,
      message: "Vendor rated successfully",
      data: vendor
    });
  } catch (error) {
    console.error("❌ Rate vendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const deleteVendorController = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Signup.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    await vendorServicesModel.deleteMany({ vendorId: id });
    await Booking.deleteMany({ vendor: id }); // 🎯 FIXED: vendor not vendorId
    await Signup.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Vendor and associated data deleted successfully"
    });
  } catch (error) {
    console.error("Delete vendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const deleteVendorServiceController = async (req, res) => {
  try {
    const { vendorId, serviceId } = req.params;

    const service = await vendorServicesModel.findOne({
      _id: serviceId,
      vendorId: vendorId
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    await vendorServicesModel.findByIdAndDelete(serviceId);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    console.error("Delete service error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ====================================
// USER MANAGEMENT
// ====================================

const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id }); // 🎯 FIXED: user not userId
        
        return {
          ...user.toObject(),
          bookingCount
        };
      })
    );

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive !== false).length,
      verifiedUsers: users.filter(u => u.verify === true).length
    };

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersWithStats,
      stats
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getUserDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const bookings = await Booking.find({ user: id }) // 🎯 FIXED: user not userId
      .populate('service')
      .populate('vendor');

    const stats = {
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.bookingStatus === 'completed').length,
      totalSpent: bookings
        .filter(b => b.payment?.advancePaid || b.payment?.remainingPaid)
        .reduce((sum, b) => {
          let amount = 0;
          if (b.payment?.advancePaid) amount += b.advancePayment || 0;
          if (b.payment?.remainingPaid) amount += b.remainingPayment || 0;
          return sum + amount;
        }, 0)
    };

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: {
        user,
        bookings,
        stats
      }
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await Booking.deleteMany({ user: id }); // 🎯 FIXED: user not userId
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User and associated bookings deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ====================================
// BOOKING MANAGEMENT
// ====================================

// 🎯 COMPLETELY FIXED: Updated to match booking model schema
const getAllBookingsController = async (req, res) => {
  try {
    console.log('📥 GET /admin/bookings called');
    
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🎯 FIXED: Updated populate paths to match booking model
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'companyName serviceCategory location image')
      .populate('vendor', 'buisnessName email phone service')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    console.log('📊 Total bookings found:', bookings.length);

    const total = await Booking.countDocuments(query);

    // 🎯 FIXED: Calculate stats based on bookingStatus field
    const stats = {
      total: await Booking.countDocuments(),
      pending: await Booking.countDocuments({ bookingStatus: 'pending' }),
      approved: await Booking.countDocuments({ bookingStatus: 'approved' }),
      payment_completed: await Booking.countDocuments({ bookingStatus: 'payment_completed' }),
      confirmed: await Booking.countDocuments({ bookingStatus: 'confirmed' }),
      completed: await Booking.countDocuments({ bookingStatus: 'completed' }),
      cancelled: await Booking.countDocuments({ bookingStatus: 'cancelled' }),
      rejected: await Booking.countDocuments({ bookingStatus: 'rejected' }),
    };

    console.log('📈 Stats:', stats);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
      stats,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("❌ Get bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getPendingBookingsController = async (req, res) => {
  try {
    // 🎯 FIXED: Use bookingStatus field
    const bookings = await Booking.find({ bookingStatus: 'pending' })
      .populate('user', 'name email phone')
      .populate('vendor', 'buisnessName email phone')
      .populate('service', 'companyName serviceCategory')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pending bookings fetched successfully",
      data: bookings
    });
  } catch (error) {
    console.error("Get pending bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// 🎯 COMPLETELY FIXED: Updated to match booking model workflow
const approveRejectBookingController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action, rejectionReason, adminNotes, adminId } = req.body;

    console.log('🔍 Booking approval request:', { bookingId, action });

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Valid action is required (approve or reject)"
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate('service')
      .populate('user')
      .populate('vendor');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.bookingStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "This booking has already been reviewed"
      });
    }

    // 🎯 FIXED: Update based on booking model schema
    if (action === 'approve') {
      booking.bookingStatus = 'approved';
      booking.adminApproval.approved = true;
      booking.adminApproval.approvedBy = adminId;
      booking.adminApproval.approvedAt = new Date();
      booking.adminApproval.adminNotes = adminNotes || '';

      await booking.save();

      console.log('✅ Booking approved successfully');

      return res.status(200).json({
        success: true,
        message: 'Booking approved successfully! Payment link will be sent to the customer.',
        data: booking,
      });
    } else if (action === 'reject') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required',
        });
      }

      booking.bookingStatus = 'rejected';
      booking.adminApproval.approved = false;
      booking.adminApproval.rejectionReason = rejectionReason;
      booking.adminApproval.adminNotes = adminNotes || '';

      await booking.save();

      console.log('❌ Booking rejected successfully');

      return res.status(200).json({
        success: true,
        message: 'Booking rejected successfully',
        data: booking,
      });
    }
  } catch (error) {
    console.error("❌ Approve/reject booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ====================================
// ANALYTICS
// ====================================

const getAnalyticsController = async (req, res) => {
  try {
    console.log('📊 Fetching analytics...');

    // Basic counts
    const totalVendors = await Signup.countDocuments();
    const verifiedVendors = await Signup.countDocuments({ isVerified: true });
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalServices = await vendorServicesModel.countDocuments();

    console.log('📈 Basic stats:', { totalVendors, totalUsers, totalBookings, totalServices });

    // Get all bookings for detailed stats
    const allBookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('vendor', 'buisnessName')
      .populate('service', 'companyName')
      .sort({ createdAt: -1 });

    console.log('📦 Total bookings fetched:', allBookings.length);

    // Calculate booking stats
    const bookingStats = {
      pending: allBookings.filter(b => b.bookingStatus === 'pending').length,
      approved: allBookings.filter(b => b.bookingStatus === 'approved').length,
      payment_completed: allBookings.filter(b => b.bookingStatus === 'payment_completed').length,
      confirmed: allBookings.filter(b => b.bookingStatus === 'confirmed').length,
      in_progress: allBookings.filter(b => b.bookingStatus === 'in_progress').length,
      completed: allBookings.filter(b => b.bookingStatus === 'completed').length,
      cancelled: allBookings.filter(b => b.bookingStatus === 'cancelled').length,
      rejected: allBookings.filter(b => b.bookingStatus === 'rejected').length,
    };

    console.log('📊 Booking stats:', bookingStats);

    // Calculate revenue
    let totalRevenue = 0;
    let advanceRevenue = 0;
    let remainingRevenue = 0;
    let pendingRevenue = 0;

    allBookings.forEach(booking => {
      // Advance paid
      if (booking.payment?.advancePaid) {
        advanceRevenue += booking.advancePayment || 0;
        totalRevenue += booking.advancePayment || 0;
      }
      
      // Remaining paid
      if (booking.payment?.remainingPaid) {
        remainingRevenue += booking.remainingPayment || 0;
        totalRevenue += booking.remainingPayment || 0;
      }

      // Pending revenue (approved but not paid)
      if (booking.bookingStatus === 'approved' || booking.bookingStatus === 'payment_pending') {
        if (!booking.payment?.advancePaid) {
          pendingRevenue += booking.advancePayment || 0;
        }
        if (!booking.payment?.remainingPaid) {
          pendingRevenue += booking.remainingPayment || 0;
        }
      }
    });

    console.log('💰 Revenue:', { total: totalRevenue, advance: advanceRevenue, remaining: remainingRevenue, pending: pendingRevenue });

    // Get recent bookings (last 10)
    const recentBookings = allBookings.slice(0, 10);

    // Get service category distribution
    const serviceCategoryStats = await vendorServicesModel.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$serviceCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('📊 Service categories:', serviceCategoryStats);

    // 🎯 CRITICAL: Structure matches dashboard expectations
    const analyticsData = {
      // Overview section - matches dashboard StatCards
      overview: {
        totalVendors,
        totalUsers,
        totalBookings,
        totalRevenue: advanceRevenue, // Dashboard shows "Revenue (Advance)"
        totalServices,
      },

      // Vendors section - matches dashboard
      vendors: {
        total: totalVendors,
        verified: verifiedVendors,
        pending: totalVendors - verifiedVendors,
      },

      // Users section
      users: {
        total: totalUsers,
      },

      // Bookings section - matches dashboard cards
      bookings: {
        total: totalBookings,
        pending: bookingStats.pending,
        approved: bookingStats.approved,
        payment_completed: bookingStats.payment_completed,
        confirmed: bookingStats.confirmed,
        in_progress: bookingStats.in_progress,
        completed: bookingStats.completed,
        cancelled: bookingStats.cancelled,
        rejected: bookingStats.rejected,
      },

      // Services section
      services: {
        total: totalServices,
      },

      // Revenue breakdown
      revenue: {
        total: totalRevenue,
        advance: advanceRevenue,
        remaining: remainingRevenue,
        pending: pendingRevenue,
      },

      // Recent bookings for dashboard
      recentBookings: recentBookings,

      // Service category stats for dashboard chart
      serviceCategoryStats: serviceCategoryStats,
    };

    console.log('✅ Analytics prepared successfully');

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: analyticsData,
    });

  } catch (error) {
    console.error("❌ Get analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  adminLoginController,
  createAdminController,
  getAllVendorsController,
  getVendorDetailsController,
  verifyVendorController,
  rateVendorController,
  deleteVendorController,
  deleteVendorServiceController,
  getAllUsersController,
  getUserDetailsController,
  deleteUserController,
  getAllBookingsController,
  getPendingBookingsController,
  approveRejectBookingController,
  getAnalyticsController,
};