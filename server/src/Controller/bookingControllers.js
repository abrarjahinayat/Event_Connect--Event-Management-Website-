const bookingModel = require("../model/booking.model");
const vendorServicesModel = require("../model/vendor.services.model");
const userSignupModel = require("../model/userSignup.model");
const signupModel = require("../model/signup.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const randomnumber = require("../utils/otp");

const store_id = process.env.STORE_ID || "your_store_id";
const store_passwd = process.env.STORE_PASSWORD || "your_store_password";
const is_live = false; // true for live, false for sandbox

// @desc    Create booking request (Step 1: User submits booking request)
// @route   POST /api/v1/booking/ask-for-booking
// @access  Private (User must be logged in)
const askForBookingController = async (req, res) => {
  try {
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventAddress,
      eventCity,
      selectedPackage, // { name, price, features }
      specialRequests,
      userId, // From auth middleware or frontend
    } = req.body;

    // Validation
    if (
      !serviceId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !eventDate ||
      !eventAddress ||
      !eventCity ||
      !selectedPackage ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if service exists
    const service = await vendorServicesModel
      .findById(serviceId)
      .populate("vendorId");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if service is available
    if (service.availability !== "Available") {
      return res.status(400).json({
        success: false,
        message:
          "This service is currently not available for booking. Please try another date or service.",
      });
    }

    // Check if user exists
    const user = await userSignupModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // Calculate pricing (10% advance, 90% remaining)
    const packagePrice = selectedPackage.price;
    const advancePayment = Math.round(packagePrice * 0.1); // 10%
    const remainingPayment = packagePrice - advancePayment; // 90%

    // Create booking
    const newBooking = new bookingModel({
      user: userId,
      service: serviceId,
      vendor: service.vendorId._id,
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventAddress,
      eventCity,
      selectedPackage: {
        name: selectedPackage.name,
        price: selectedPackage.price,
        features: selectedPackage.features,
      },
      specialRequests: specialRequests || "",
      packagePrice,
      advancePayment,
      remainingPayment,
      totalPrice: packagePrice,
      bookingStatus: "pending",
      "adminApproval.approved": false,
      "payment.paymentStatus": "unpaid",
      vendorContactShared: false,
    });

    await newBooking.save();

    // TODO: Send email notification to admin for review
    // TODO: Send confirmation email to user

    return res.status(201).json({
      success: true,
      message:
        "Booking request submitted successfully! Our admin will review and approve within 24 hours. You will receive a payment link once approved.",
      data: {
        bookingId: newBooking._id,
        bookingStatus: newBooking.bookingStatus,
        serviceName: service.companyName,
        packageName: selectedPackage.name,
        totalPrice: packagePrice,
        advancePayment: advancePayment,
        remainingPayment: remainingPayment,
        eventDate: eventDate,
      },
    });
  } catch (error) {
    console.error("❌ Ask for booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking request",
      error: error.message,
    });
  }
};

// @desc    Admin approves booking (Step 2: Admin approves and initiates payment)
// @route   PUT /api/v1/booking/admin-approve/:bookingId
// @access  Private (Admin only)
const adminApproveBookingController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { approved, rejectionReason, adminNotes, adminId } = req.body;

    const booking = await bookingModel
      .findById(bookingId)
      .populate("service")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been reviewed",
      });
    }

    if (approved) {
      // Approve booking
      booking.bookingStatus = "approved";
      booking.adminApproval.approved = true;
      booking.adminApproval.approvedBy = adminId;
      booking.adminApproval.approvedAt = new Date();
      booking.adminApproval.adminNotes = adminNotes || "";

      await booking.save();

      // TODO: Send payment link email to user
      // TODO: Send notification to vendor

      return res.status(200).json({
        success: true,
        message:
          "Booking approved! Payment link will be sent to the customer.",
        data: booking,
      });
    } else {
      // Reject booking
      booking.bookingStatus = "rejected";
      booking.adminApproval.approved = false;
      booking.adminApproval.rejectionReason =
        rejectionReason || "Not specified";
      booking.adminApproval.adminNotes = adminNotes || "";

      await booking.save();

      // TODO: Send rejection email to user

      return res.status(200).json({
        success: true,
        message: "Booking rejected",
        data: booking,
      });
    }
  } catch (error) {
    console.error("❌ Admin approve error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process booking approval",
      error: error.message,
    });
  }
};

// @desc    Initiate payment (Step 3: User initiates 10% advance payment)
// @route   POST /api/v1/booking/initiate-payment/:bookingId
// @access  Private (User only)
// @desc    Initiate payment
const initiatePaymentController = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel
      .findById(bookingId)
      .populate("service")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This booking is not approved yet.",
      });
    }

    if (booking.payment.advancePaid) {
      return res.status(400).json({
        success: false,
        message: "Advance payment already completed",
      });
    }

    const otp = randomnumber();
    const tran_id = `BOOK${otp}${Date.now()}`;

    booking.bookingStatus = "payment_pending";
    booking.payment.transactionId = tran_id;
    await booking.save();

    // ✅ FIX: Use CLIENT_URL for callbacks instead of SERVER_URL
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
    
    const data = {
      total_amount: booking.advancePayment,
      currency: "BDT",
      tran_id: tran_id,
      // ✅ FIXED: Point directly to frontend pages
      success_url: `${CLIENT_URL}/booking/payment-success?tran_id=${tran_id}&bookingId=${booking._id}`,
      fail_url: `${CLIENT_URL}/booking/payment-failed?tran_id=${tran_id}&reason=payment_failed`,
      cancel_url: `${CLIENT_URL}/booking/payment-failed?tran_id=${tran_id}&reason=user_cancelled`,
      ipn_url: `${process.env.SERVER_URL}/api/v1/booking/payment-ipn`, // Keep this as API
      shipping_method: "NO",
      product_name: `${booking.service.companyName} - ${booking.selectedPackage.name}`,
      product_category: "Event Service Booking",
      product_profile: "general",

      cus_name: booking.customerName,
      cus_email: booking.customerEmail,
      cus_add1: booking.eventAddress,
      cus_add2: booking.eventCity,
      cus_city: booking.eventCity,
      cus_state: booking.eventCity,
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: booking.customerPhone,
      cus_fax: booking.customerPhone,

      ship_name: booking.customerName,
      ship_add1: booking.eventAddress,
      ship_add2: booking.eventCity,
      ship_city: booking.eventCity,
      ship_state: booking.eventCity,
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (!apiResponse || !apiResponse.GatewayPageURL) {
      return res.status(500).json({
        success: false,
        message: "Failed to initiate payment.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      paymentUrl: apiResponse.GatewayPageURL,
      data: {
        bookingId: booking._id,
        transactionId: tran_id,
        advanceAmount: booking.advancePayment,
      },
    });
  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
      error: error.message,
    });
  }
};

// @desc    Payment success callback
// @route   POST /api/v1/booking/payment-success/:tran_id
// @access  Public (SSL Commerce callback)
const paymentSuccessController = async (req, res) => {
  try {
    const { tran_id } = req.params;

    const booking = await bookingModel
      .findOne({ "payment.transactionId": tran_id })
      .populate("service")
      .populate("vendor");

    if (!booking) {
      return res.redirect(
        `${process.env.CLIENT_URL}/booking/payment-failed?error=booking_not_found`
      );
    }

    // Update booking
    booking.bookingStatus = "payment_completed";
    booking.payment.advancePaid = true;
    booking.payment.advancePaidAt = new Date();
    booking.payment.paymentStatus = "advance_paid";
    booking.vendorContactShared = true; // Now user can see vendor contact

    await booking.save();

    // TODO: Send confirmation email with vendor contact details
    // TODO: Notify vendor about new confirmed booking

    // Redirect to success page
    return res.redirect(
      `${process.env.CLIENT_URL}/booking/payment-success?bookingId=${booking._id}`
    );
  } catch (error) {
    console.error("❌ Payment success error:", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/booking/payment-failed?error=server_error`
    );
  }
};

// @desc    Payment failed callback
// @route   POST /api/v1/booking/payment-fail/:tran_id
// @access  Public (SSL Commerce callback)
const paymentFailController = async (req, res) => {
  try {
    const { tran_id } = req.params;

    const booking = await bookingModel.findOne({
      "payment.transactionId": tran_id,
    });

    if (booking) {
      booking.bookingStatus = "approved"; // Revert to approved
      await booking.save();
    }

    return res.redirect(
      `${process.env.CLIENT_URL}/booking/payment-failed?reason=payment_failed`
    );
  } catch (error) {
    console.error("❌ Payment fail error:", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/booking/payment-failed?error=server_error`
    );
  }
};

// @desc    Payment cancel callback
// @route   POST /api/v1/booking/payment-cancel/:tran_id
// @access  Public (SSL Commerce callback)
const paymentCancelController = async (req, res) => {
  try {
    const { tran_id } = req.params;

    const booking = await bookingModel.findOne({
      "payment.transactionId": tran_id,
    });

    if (booking) {
      booking.bookingStatus = "approved"; // Revert to approved
      await booking.save();
    }

    return res.redirect(
      `${process.env.CLIENT_URL}/booking/payment-cancelled?reason=user_cancelled`
    );
  } catch (error) {
    console.error("❌ Payment cancel error:", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/booking/payment-failed?error=server_error`
    );
  }
};

// @desc    Get user bookings
// @route   GET /api/v1/booking/my-bookings/:userId
// @access  Private (User only)
const getUserBookingsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };

    if (status && status !== "all") {
      query.bookingStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await bookingModel
      .find(query)
      .populate("service", "companyName image location serviceCategory")
      .populate("vendor", "buisnessName email phone")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await bookingModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bookings,
    });
  } catch (error) {
    console.error("❌ Get user bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// @desc    Get single booking details
// @route   GET /api/v1/booking/:bookingId
// @access  Private (User/Vendor/Admin)
const getSingleBookingController = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel
      .findById(bookingId)
      .populate("service")
      .populate("vendor", "buisnessName email phone image")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      data: booking,
    });
  } catch (error) {
    console.error("❌ Get single booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      error: error.message,
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/v1/booking/cancel/:bookingId
// @access  Private (User/Admin)
const cancelBookingController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason, cancelledBy } = req.body; // 'user' or 'admin'

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if already cancelled
    if (booking.cancellation.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Check if can be cancelled
    if (
      booking.bookingStatus === "completed" ||
      booking.bookingStatus === "in_progress"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed or ongoing bookings",
      });
    }

    // Update cancellation
    booking.bookingStatus = "cancelled";
    booking.cancellation.cancelled = true;
    booking.cancellation.cancelledBy = cancelledBy;
    booking.cancellation.cancelledAt = new Date();
    booking.cancellation.cancellationReason = cancellationReason;

    // Process refund if payment was made
    if (booking.payment.advancePaid) {
      booking.cancellation.refundProcessed = true;
      booking.cancellation.refundAmount = booking.advancePayment;
      booking.payment.paymentStatus = "refunded";
      // TODO: Implement actual refund processing
    }

    await booking.save();

    // TODO: Send cancellation email
    // TODO: Notify vendor

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("❌ Cancel booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// @desc    Payment IPN (SSL Commerce notification)
// @route   POST /api/v1/booking/payment-ipn
// @access  Public (SSL Commerce callback)
const paymentIPNController = async (req, res) => {
  try {
    console.log('📬 IPN Received:', req.body);
    
    const { tran_id, status, val_id } = req.body;

    const booking = await bookingModel
      .findOne({ "payment.transactionId": tran_id })
      .populate("service")
      .populate("vendor");

    if (!booking) {
      console.log('❌ Booking not found for transaction:', tran_id);
      return res.status(200).send('OK'); // Still return OK to SSL Commerce
    }

    // Check payment status
    if (status === 'VALID' || status === 'VALIDATED') {
      // Payment successful
      booking.bookingStatus = "payment_completed";
      booking.payment.advancePaid = true;
      booking.payment.advancePaidAt = new Date();
      booking.payment.paymentStatus = "advance_paid";
      booking.payment.validationId = val_id;
      booking.vendorContactShared = true;

      await booking.save();

      console.log('✅ Payment confirmed for booking:', booking._id);
      
      // TODO: Send confirmation email
    } else if (status === 'FAILED') {
      // Payment failed
      booking.bookingStatus = "approved";
      await booking.save();
      
      console.log('❌ Payment failed for booking:', booking._id);
    }

    return res.status(200).send('OK');
    
  } catch (error) {
    console.error("❌ IPN error:", error);
    return res.status(200).send('OK'); // Always return OK to SSL Commerce
  }
};

// @desc    Verify payment after redirect
// @route   POST /api/v1/booking/verify-payment
// @access  Public
const verifyPaymentController = async (req, res) => {
  try {
    const { bookingId, transactionId } = req.body;

    const booking = await bookingModel
      .findOne({ 
        _id: bookingId,
        "payment.transactionId": transactionId 
      })
      .populate("service", "companyName serviceCategory location image")
      .populate("vendor", "buisnessName email phone")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update booking if payment successful
    if (booking.bookingStatus === "payment_pending") {
      booking.bookingStatus = "payment_completed";
      booking.payment.advancePaid = true;
      booking.payment.advancePaidAt = new Date();
      booking.payment.paymentStatus = "advance_paid";
      booking.vendorContactShared = true;
      await booking.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: booking,
    });

  } catch (error) {
    console.error("❌ Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

const getVendorBookingsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const bookings = await bookingModel
      .find({ vendor: vendorId })
      .populate('user', 'name email phone')
      .populate('service', 'companyName serviceCategory')
      .sort({ createdAt: -1 });

    // Calculate some stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.bookingStatus === 'pending').length,
      approved: bookings.filter(b => b.bookingStatus === 'approved').length,
      payment_completed: bookings.filter(b => b.bookingStatus === 'payment_completed').length,
      confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
      in_progress: bookings.filter(b => b.bookingStatus === 'in_progress').length,
      completed: bookings.filter(b => b.bookingStatus === 'completed').length,
      cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
      rejected: bookings.filter(b => b.bookingStatus === 'rejected').length,
    };

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
      message: 'Vendor bookings fetched successfully',
      data: bookings,
      stats,
      revenue,
    });
  } catch (error) {
    console.error('Get vendor bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message || error,
    });
  }
};

// @desc    Get vendor's earnings data
// @route   GET /api/v1/booking/vendor/:vendorId/earnings
// @access  Private (Vendor only)
const getVendorEarningsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const bookings = await bookingModel
      .find({ vendor: vendorId })
      .sort({ createdAt: -1 });

    // Calculate earnings
    const earnings = {
      totalRevenue: 0,
      advanceReceived: 0,
      remainingPending: 0,
      remainingReceived: 0,
      completedBookings: 0,
      upcomingRevenue: 0,
    };

    const monthlyData = {};
    const packageBreakdown = {};

    bookings.forEach(booking => {
      // Total revenue from paid bookings
      if (booking.payment?.advancePaid) {
        earnings.advanceReceived += booking.advancePayment || 0;
        earnings.totalRevenue += booking.advancePayment || 0;
      }

      if (booking.payment?.remainingPaid) {
        earnings.remainingReceived += booking.remainingPayment || 0;
        earnings.totalRevenue += booking.remainingPayment || 0;
      }

      // Remaining pending (advance paid but remaining not paid)
      if (booking.payment?.advancePaid && !booking.payment?.remainingPaid) {
        earnings.remainingPending += booking.remainingPayment || 0;
      }

      // Upcoming revenue (approved but not paid)
      if (booking.bookingStatus === 'approved' || booking.bookingStatus === 'payment_pending') {
        earnings.upcomingRevenue += booking.totalPrice || 0;
      }

      // Completed bookings
      if (booking.bookingStatus === 'completed') {
        earnings.completedBookings++;
      }

      // Monthly data
      const month = new Date(booking.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      if (booking.payment?.advancePaid || booking.payment?.remainingPaid) {
        let amount = 0;
        if (booking.payment?.advancePaid) amount += booking.advancePayment || 0;
        if (booking.payment?.remainingPaid) amount += booking.remainingPayment || 0;
        monthlyData[month] += amount;
      }

      // Package breakdown
      const pkgName = booking.selectedPackage?.name || 'Unknown';
      if (!packageBreakdown[pkgName]) {
        packageBreakdown[pkgName] = { count: 0, revenue: 0 };
      }
      packageBreakdown[pkgName].count++;
      if (booking.payment?.advancePaid || booking.payment?.remainingPaid) {
        let amount = 0;
        if (booking.payment?.advancePaid) amount += booking.advancePayment || 0;
        if (booking.payment?.remainingPaid) amount += booking.remainingPayment || 0;
        packageBreakdown[pkgName].revenue += amount;
      }
    });

    // Average booking value
    const paidBookingsCount = bookings.filter(b => 
      b.payment?.advancePaid || b.payment?.remainingPaid
    ).length;
    earnings.averageBookingValue = paidBookingsCount > 0 
      ? earnings.totalRevenue / paidBookingsCount 
      : 0;

    return res.status(200).json({
      success: true,
      message: 'Vendor earnings fetched successfully',
      data: {
        earnings,
        monthlyData,
        packageBreakdown,
        totalBookings: bookings.length,
      },
    });
  } catch (error) {
    console.error('Get vendor earnings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message || error,
    });
  }
};

module.exports = {
  askForBookingController,
  adminApproveBookingController,
  initiatePaymentController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
  getUserBookingsController,
  getSingleBookingController,
  cancelBookingController,
    paymentIPNController,
    verifyPaymentController,
    getVendorBookingsController,
    getVendorEarningsController
};