const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSignupModel = require("../model/userSignup.model");

// ✅ User Signup Controller
const usersignupControllers = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    let userExist = await userSignupModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // ✅ Create new user (password will be hashed by pre-save hook)
    let user = new userSignupModel({
      name,
      email,
      password,
      phone,
    });

    await user.save();

    // ✅ Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User signup successfully",
      data: userResponse,
    });

  } catch (err) {
    console.error("Signup error:", err);
    
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: err.message,
    });
  }
};

// ✅ User Login Controller
const userloginControllers = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user and explicitly select password field
    let user = await userSignupModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Compare password using await
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Generate JWT token
      let token = jwt.sign(
        { 
          email: user.email, 
          id: user._id,
          name: user.name 
        },
        process.env.PRIVATE_KEY,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: "User login successfully",
        data: userResponse,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
};

module.exports = {
  usersignupControllers,
  userloginControllers,
};