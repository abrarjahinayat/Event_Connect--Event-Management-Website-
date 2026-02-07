const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const vendorServicesModel = require("../model/vendor.services.model");
const signupModel = require("../model/signup.model");

// @desc    Add new vendor service
// @route   POST /api/v1/services/addservices
// @access  Private (Vendor only)
const addvendorServicesControllers = async (req, res) => {
  try {
    let {
      companyName,
      tagline,
      aboutYourCompany,
      location,
      fullAddress,
      startingPrice,
      specialties,
      features,
      services,
      packages,
      contact,
      vendorId,
      availability,
    } = req.body;

    console.log('📥 Received service submission');
    console.log('📦 Vendor ID:', vendorId);
    console.log('📁 Files received:', req.files);

    // 🎯 Get service category from vendor registration
    const vendor = await signupModel.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    const serviceCategory = vendor.service;
    console.log('✅ Service category from vendor registration:', serviceCategory);

    // 🎯 Check if individual service provider needs profile picture
    const individualCategories = ['Photographers', 'Cinematographers', 'Cooks & Caterers'];
    const isIndividualProvider = individualCategories.includes(serviceCategory);

    let profilePicturePath = null;
    if (isIndividualProvider) {
      // 🎯 FIXED: When using upload.fields(), req.files is an OBJECT, not an array
      // Access it like: req.files.profilePicture or req.files['profilePicture']
      const profilePicFiles = req.files?.profilePicture;
      
      if (profilePicFiles && profilePicFiles.length > 0) {
        profilePicturePath = `${process.env.SERVER_URL}/uploads/${profilePicFiles[0].filename}`;
        console.log('✅ Profile picture uploaded:', profilePicturePath);
      } else {
        console.log('⚠️ No profile picture uploaded for individual provider');
        // 🎯 OPTIONAL: Make it optional for now, or return error if required
        // return res.status(400).json({
        //   success: false,
        //   message: `Profile picture is required for ${serviceCategory}`
        // });
      }
    }

    // 🎯 FIXED: Handle service images (when using upload.fields())
    let imagePaths = [];
    if (req.files?.image && req.files.image.length > 0) {
      imagePaths = req.files.image.map((file) => {
        return `${process.env.SERVER_URL}/uploads/${file.filename}`;
      });
    }

    console.log('📸 Service images:', imagePaths.length);
    console.log('🖼️ Profile picture:', profilePicturePath);

    // Generate slug from company name
    let slug = slugify(companyName, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    // Check if slug already exists
    const existingSlug = await vendorServicesModel.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Validation
    if (!companyName || !aboutYourCompany || !location || !startingPrice || !specialties || !contact) {
      return res.status(400).json({ 
        success: false,
        message: "All required fields must be provided" 
      });
    }

    // Parse JSON strings if they come as strings
    if (typeof specialties === 'string') specialties = JSON.parse(specialties);
    if (typeof features === 'string') features = JSON.parse(features);
    if (typeof services === 'string') services = JSON.parse(services);
    if (typeof packages === 'string') packages = JSON.parse(packages);
    if (typeof contact === 'string') contact = JSON.parse(contact);

    // Validate required fields
    if (!features || features.length === 0 || features.every(f => !f.trim())) {
      return res.status(400).json({
        success: false,
        message: "At least one key feature is required"
      });
    }

    if (!services || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one service offered is required"
      });
    }

    if (!packages || packages.length === 0 || packages.every(p => !p.name)) {
      return res.status(400).json({
        success: false,
        message: "At least one pricing package is required"
      });
    }

    if (!contact || !contact.phone || !contact.email) {
      return res.status(400).json({
        success: false,
        message: "Contact information (phone and email) is required"
      });
    }

    // Parse portfolio
    let portfolio = req.body.portfolio;
    if (typeof portfolio === 'string') {
      try {
        portfolio = JSON.parse(portfolio);
        console.log('✅ Portfolio parsed successfully');
        console.log('📊 Portfolio items:', portfolio.length);
      } catch (error) {
        console.error('❌ Portfolio parse error:', error);
        portfolio = [];
      }
    } else if (Array.isArray(portfolio)) {
      console.log('✅ Portfolio is already an array');
      console.log('📊 Portfolio items:', portfolio.length);
    } else {
      console.log('⚠️ Portfolio is not a string or array');
      portfolio = [];
    }

    // Create new service
    let addservices = await new vendorServicesModel({
      companyName,
      tagline,
      aboutYourCompany,
      location,
      fullAddress: fullAddress || location,
      startingPrice,
      specialties,
      features: features || [],
      services: services || [],
      packages: packages || [],
      portfolio: portfolio || [],
      contact,
      serviceCategory,
      profilePicture: profilePicturePath,
      vendorId,
      availability: availability || "Available",
      available: availability === "Available",
      image: imagePaths || [],
      images: imagePaths || [],
      slug,
      rating: 0,
      reviewCount: 0,
    });

    await addservices.save();

    console.log('✅ Service created successfully!');
    console.log('📊 Service ID:', addservices._id);
    console.log('📊 Company:', addservices.companyName);
    console.log('📊 Category:', addservices.serviceCategory);
    console.log('📊 Profile Picture:', addservices.profilePicture);
    console.log('📊 Portfolio items saved:', addservices.portfolio?.length || 0);

    return res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: addservices,
    });
  } catch (error) {
    console.error("❌ Add service error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Get all vendor services (with filters)
// @route   GET /api/v1/services/allservices
// @access  Public
const getallvendorServicesControllers = async (req, res) => {
  try {
    const {
      serviceCategory,
      location,
      availability,
      minPrice,
      maxPrice,
      minRating,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (serviceCategory) {
      query.serviceCategory = serviceCategory;
    }

    if (location && location !== 'all') {
      query.location = location;
    }

    if (availability && availability !== 'all') {
      if (availability === 'available') {
        query.availability = 'Available';
        query.available = true;
      } else if (availability === 'booked') {
        query.availability = 'Booked';
      }
    }

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.startingPrice.$lte = parseInt(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { specialties: { $in: [new RegExp(search, "i")] } },
        { aboutYourCompany: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    let services = await vendorServicesModel
      .find(query)
      .populate({
        path: "vendorId",
        select: "buisnessName email phone service adminRating adminRatingComment isVerified verificationStatus image"
      })
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOptions);

    const total = await vendorServicesModel.countDocuments(query);

    console.log('✅ Services fetched:', services.length);

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      count: services.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: services,
    });
  } catch (error) {
    console.error("Get all services error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Get single service by ID or slug
// @route   GET /api/v1/services/:identifier
// @access  Public
const getSingleServiceController = async (req, res) => {
  try {
    const { identifier } = req.params;

    let service;

    // Check if identifier is MongoDB ObjectId or slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      service = await vendorServicesModel
        .findById(identifier)
        .populate({
          path: "vendorId",
          select: "buisnessName email phone service adminRating adminRatingComment isVerified verificationStatus image"
        });
    } else {
      service = await vendorServicesModel
        .findOne({ slug: identifier })
        .populate({
          path: "vendorId",
          select: "buisnessName email phone service adminRating adminRatingComment isVerified verificationStatus image"
        });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error) {
    console.error("Get single service error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Update vendor service
// @route   PUT /api/v1/services/:id
// @access  Private (Vendor only)
const updateServiceController = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📥 Service ID:', id);
    console.log('📦 Received availability:', req.body.availability);

    const service = await vendorServicesModel.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (req.body.availability) {
      service.availability = req.body.availability;
      
      if (req.body.availability === "Available") {
        service.available = true;
      } else {
        service.available = false;
      }
    }

    await service.save();

    console.log('✅ Updated availability to:', service.availability);

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Delete vendor service
// @route   DELETE /api/v1/services/:id
// @access  Private (Vendor only)
const deleteServiceController = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await vendorServicesModel.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isActive = false;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Get services by vendor ID
// @route   GET /api/v1/services/vendor/:vendorId
// @access  Public
const getServicesByVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const services = await vendorServicesModel
      .find({ vendorId, isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Vendor services fetched successfully",
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Get vendor services error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Get services by category
// @route   GET /api/v1/services/category/:category
// @access  Public
const getServicesByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;

    const services = await vendorServicesModel
      .find({ 
        serviceCategory: category,
        isActive: true,
        availability: "Available"
      })
      .populate({
        path: "vendorId",
        select: "buisnessName email phone service adminRating adminRatingComment isVerified verificationStatus image"
      })
      .sort({ rating: -1 });

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Get services by category error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

// @desc    Create booking request
// @route   POST /api/v1/services/:id/book
// @access  Public
const createBookingController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, date, package: packageName, message } = req.body;

    if (!name || !email || !phone || !date) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and date are required",
      });
    }

    const service = await vendorServicesModel.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (service.availability !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This service is not available for booking",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully. The vendor will contact you within 24 hours.",
      data: {
        serviceName: service.companyName,
        customerName: name,
        requestedDate: date,
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const addReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingId, userId, name, avatar, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Name, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const service = await vendorServicesModel.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const existingReview = service.reviews.find(
      review => review.userId && review.userId.toString() === userId
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this service",
      });
    }

    const newReview = {
      id: service.reviews.length + 1,
      userId: userId,
      name,
      avatar: avatar || "",
      rating: parseInt(rating),
      comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      createdAt: new Date(),
    };

    service.reviews.push(newReview);

    const totalRating = service.reviews.reduce((sum, review) => sum + review.rating, 0);
    service.rating = (totalRating / service.reviews.length).toFixed(1);
    service.reviewCount = service.reviews.length;

    await service.save();

    if (bookingId) {
      try {
        const Booking = require('../model/booking.model');
        await Booking.findByIdAndUpdate(bookingId, {
          hasReviewed: true,
          review: {
            rating: parseInt(rating),
            comment,
            createdAt: new Date(),
          }
        });
      } catch (error) {
        console.error('Error updating booking review status:', error);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: service,
    });
  } catch (error) {
    console.error("Add review error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getAllReviewsController = async (req, res) => {
  try {
    const { limit = 50, minRating } = req.query;

    const services = await vendorServicesModel
      .find({ isActive: true, 'reviews.0': { $exists: true } })
      .select('companyName serviceCategory reviews')
      .lean();

    let allReviews = [];
    
    services.forEach(service => {
      service.reviews.forEach(review => {
        allReviews.push({
          ...review,
          serviceName: service.companyName,
          serviceCategory: service.serviceCategory,
          serviceId: service._id,
        });
      });
    });

    if (minRating) {
      allReviews = allReviews.filter(review => review.rating >= parseFloat(minRating));
    }

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    allReviews = allReviews.slice(0, parseInt(limit));

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      count: allReviews.length,
      data: allReviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const getServiceReviewsController = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await vendorServicesModel
      .findById(id)
      .select('companyName reviews rating reviewCount');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        serviceName: service.companyName,
        avgRating: service.rating,
        totalReviews: service.reviewCount,
        reviews: service.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      },
    });
  } catch (error) {
    console.error("Get service reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

module.exports = {
  addvendorServicesControllers,
  getallvendorServicesControllers,
  getSingleServiceController,
  updateServiceController,
  deleteServiceController,
  getServicesByVendorController,
  getServicesByCategoryController,
  createBookingController,
  addReviewController,
  getAllReviewsController,
  getServiceReviewsController,
};