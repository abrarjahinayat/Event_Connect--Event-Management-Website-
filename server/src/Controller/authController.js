const signupModel = require("../model/signup.model");
const randomnumber = require("../utils/otp");
const sendEmail = require("../utils/send_email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res, next) => {
  try {
    const otp = randomnumber();
    let { buisnessName, email, password, phone, service, businessRegistrationNumber, ownerNationalId } = req.body;

    // ✅ Validate required verification fields
    if (!businessRegistrationNumber) {
      return res.status(400).json({
        success: false,
        message: "Business registration number is required"
      });
    }

    if (!ownerNationalId) {
      return res.status(400).json({
        success: false,
        message: "Owner National ID is required"
      });
    }

    // ✅ Check if files are uploaded
    if (!req.files || !req.files.tradeLicense || !req.files.nidDocument) {
      return res.status(400).json({
        success: false,
        message: "Trade License and NID documents are required"
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

    // Check if business registration number already exists
    let businessExists = await signupModel.findOne({ businessRegistrationNumber });

    if (businessExists) {
      return res.status(400).json({
        success: false,
        message: "Business registration number already exists"
      });
    }

    // ✅ Hash the password BEFORE saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Get file paths from multer
    const tradeLicensePath = req.files.tradeLicense[0].path;
    const nidDocumentPath = req.files.nidDocument[0].path;
    const imagePath = req.files.image ? req.files.image[0].path : null;

    // ✅ Format URLs with SERVER_URL (replace backslashes with forward slashes for Windows compatibility)
    const tradeLicenseUrl = `${process.env.SERVER_URL}/${tradeLicensePath.replace(/\\/g, '/')}`;
    const nidDocumentUrl = `${process.env.SERVER_URL}/${nidDocumentPath.replace(/\\/g, '/')}`;
    const imageUrl = imagePath ? `${process.env.SERVER_URL}/${imagePath.replace(/\\/g, '/')}` : null;

    // ✅ Create new user with verification documents
    let user = new signupModel({
      buisnessName,
      email,
      password: hashedPassword,
      phone,
      service,
      businessRegistrationNumber,
      ownerNationalId,
      verificationDocuments: {
        tradeLicense: tradeLicenseUrl,
        nidDocument: nidDocumentUrl
      },
      image: imageUrl,
      otp,
      verificationStatus: 'Pending',
      isVerified: false
    });

    await user.save();

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

    let info = {
      buisnessName: user.buisnessName,
      email: user.email,
      businessRegistrationNumber: user.businessRegistrationNumber,
      verificationStatus: user.verificationStatus,
      message: "Registration successful! Please verify OTP. Your account will be reviewed by admin for verification."
    };

    return res.status(201).json({
      success: true,
      message: "User signup successfully. Pending admin verification.",
      data: info,
    });

  } catch (err) {
    console.error("Signup Error:", err);
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

// 🎯 FIXED LOGIN CONTROLLER
const loginControllers = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    console.log('📧 Vendor login attempt for:', email);

    // ✅ Get user with password field
    let user = await signupModel.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log('✅ User found:', user.buisnessName);

    // ✅ Check if user is verified
    if (!user.verify) {
      console.log('❌ Email not verified');
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP first",
      });
    }

    console.log('✅ Email verified');

    // ✅ Use await instead of callback
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      console.log('✅ Password correct');

      let token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.PRIVATE_KEY,
        { expiresIn: "24h" }
      );

      console.log('✅ Token generated');

      // ✅ CRITICAL FIX: Create vendor object with all necessary fields
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

      // ✅ CRITICAL: Return 'vendor' field (not 'data')
      return res.status(200).json({
        success: true,
        message: "User login successfully",
        token: token,
        vendor: vendorData,  // ✅ THIS IS THE KEY CHANGE!
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

module.exports = { signupController, verifyOtpControllers, loginControllers };