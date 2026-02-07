const signupModel = require("../model/signup.model");
const randomnumber = require("../utils/otp");
const sendEmail = require("../utils/send_email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res, next) => {
  try {
    const otp = randomnumber();
    let { buisnessName, email, password, phone, service, businessRegistrationNumber, ownerNationalId } = req.body;

    console.log("📥 Signup Request");
    console.log("📦 Service:", service);
    console.log("📦 Business Reg Number:", businessRegistrationNumber);
    console.log("📁 Files:", req.files);

    // 🎯 CRITICAL: Define individual service categories
    const individualServiceCategories = [
      'Photographers',
      'Cinematographers',
      'Cooks & Caterers'
    ];

    // 🎯 Check if this is an individual service provider
    const isIndividualService = individualServiceCategories.includes(service);

    console.log("✅ Is Individual Service:", isIndividualService);

    // 🎯 FIXED: Conditional validation based on service type
    if (!isIndividualService) {
      // Business services require business registration
      if (!businessRegistrationNumber) {
        return res.status(400).json({
          success: false,
          message: "Business registration number is required for business services"
        });
      }

      // Check if files include trade license
      if (!req.files || !req.files.tradeLicense) {
        return res.status(400).json({
          success: false,
          message: "Trade License document is required for business services"
        });
      }
    }

    // Owner NID is required for everyone
    if (!ownerNationalId) {
      return res.status(400).json({
        success: false,
        message: "National ID is required"
      });
    }

    // NID document is required for everyone
    if (!req.files || !req.files.nidDocument) {
      return res.status(400).json({
        success: false,
        message: "NID document is required"
      });
    }

    // Check if user exists
    let userExist = await signupModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // 🎯 FIXED: Only check business registration for non-individual services
    if (!isIndividualService && businessRegistrationNumber) {
      let businessExists = await signupModel.findOne({ businessRegistrationNumber });

      if (businessExists) {
        return res.status(400).json({
          success: false,
          message: "Business registration number already exists"
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🎯 FIXED: Get file paths conditionally
    let tradeLicensePath = null;
    let tradeLicenseUrl = null;
    
    // Only process trade license for business services
    if (!isIndividualService && req.files.tradeLicense) {
      tradeLicensePath = req.files.tradeLicense[0].path;
      tradeLicenseUrl = `${process.env.SERVER_URL}/${tradeLicensePath.replace(/\\/g, '/')}`;
    }

    const nidDocumentPath = req.files.nidDocument[0].path;
    const nidDocumentUrl = `${process.env.SERVER_URL}/${nidDocumentPath.replace(/\\/g, '/')}`;
    
    const imagePath = req.files.image ? req.files.image[0].path : null;
    const imageUrl = imagePath ? `${process.env.SERVER_URL}/${imagePath.replace(/\\/g, '/')}` : null;

    // 🎯 FIXED: Create user object conditionally
    const userData = {
      buisnessName,
      email,
      password: hashedPassword,
      phone,
      service,
      ownerNationalId,
      verificationDocuments: {
        nidDocument: nidDocumentUrl
      },
      otp,
      verificationStatus: 'Pending',
      isVerified: false
    };

    // Add business-specific fields only for non-individual services
    if (!isIndividualService) {
      userData.businessRegistrationNumber = businessRegistrationNumber;
      userData.verificationDocuments.tradeLicense = tradeLicenseUrl;
    }

    // Add image if provided
    if (imageUrl) {
      userData.image = imageUrl;
    }

    console.log("📦 Creating user with data:", {
      ...userData,
      password: '[HIDDEN]'
    });

    // Create new user
    let user = new signupModel(userData);

    await user.save();

    console.log("✅ User created successfully");

    // Send OTP email
    sendEmail(email, otp);

    // Remove OTP after 60 seconds
    setTimeout(async () => {
      await signupModel.findOneAndUpdate(
        { email },
        { otp: null },
        { new: true }
      );
      console.log("OTP removed successfully");
    }, 60000);

    // 🎯 Prepare response info
    let info = {
      buisnessName: user.buisnessName,
      email: user.email,
      service: user.service,
      verificationStatus: user.verificationStatus,
      message: isIndividualService 
        ? "Registration successful! Please verify OTP. Your NID will be reviewed by admin for verification."
        : "Registration successful! Please verify OTP. Your account will be reviewed by admin for verification."
    };

    // Add business reg number only if it exists
    if (user.businessRegistrationNumber) {
      info.businessRegistrationNumber = user.businessRegistrationNumber;
    }

    return res.status(201).json({
      success: true,
      message: isIndividualService 
        ? "Individual professional signup successful. Pending admin verification."
        : "Business signup successful. Pending admin verification.",
      data: info,
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    next(err);
  }
};

const verifyOtpControllers = async (req, res, next) => {
  try {
    let { email, otp } = req.body;

    let user = await signupModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp === otp) {
      let verifyuser = await signupModel
        .findOneAndUpdate(
          { email }, 
          { verify: true, otp: null }, 
          { new: true }
        )
        .select("-password");
        
      return res.status(200).json({
        success: true,
        message: "Email verified successfully! Your account is pending admin verification.",
        data: {
          ...verifyuser.toObject(),
          verificationNote: "Your documents are under review. You'll be notified once verified."
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (err) {
    next(err);
  }
};

const loginControllers = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    console.log('📧 Vendor login attempt for:', email);

    // Get user with password field
    let user = await signupModel.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log('✅ User found:', user.buisnessName);

    // Check if user is verified
    if (!user.verify) {
      console.log('❌ Email not verified');
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP first",
      });
    }

    console.log('✅ Email verified');

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      console.log('✅ Password correct');

      let token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.PRIVATE_KEY,
        { expiresIn: "24h" }
      );

      console.log('✅ Token generated');

      // Create vendor object with all necessary fields
      const vendorData = {
        _id: user._id,
        buisnessName: user.buisnessName,
        email: user.email,
        phone: user.phone,
        service: user.service,
        businessRegistrationNumber: user.businessRegistrationNumber,
        ownerNationalId: user.ownerNationalId,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
        image: user.image
      };

      console.log('📦 Sending vendor data:', vendorData);

      return res.status(200).json({
        success: true,
        message: "User login successfully",
        token: token,
        vendor: vendorData,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified
      });
    } else {
      console.log('❌ Invalid password');
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    next(err);
  }
};

// Get Vendor by ID
const getVendorByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log('🔍 Fetching vendor by ID:', id);

    // Find vendor and exclude password
    const vendor = await signupModel.findById(id).select('-password -otp');

    if (!vendor) {
      console.log('❌ Vendor not found');
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    console.log('✅ Vendor found:', vendor.buisnessName);

    return res.status(200).json({
      success: true,
      message: "Vendor fetched successfully",
      data: vendor
    });

  } catch (err) {
    console.error('❌ Get vendor error:', err);
    next(err);
  }
};

module.exports = { 
  signupController, 
  verifyOtpControllers, 
  loginControllers,
  getVendorByIdController
};