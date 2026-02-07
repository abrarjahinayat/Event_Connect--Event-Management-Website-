const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Create necessary directories
ensureDirectoryExists('uploads/');
ensureDirectoryExists('uploads/verification-docs/');
ensureDirectoryExists('uploads/portfolio/');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Separate folders for different document types
        if (file.fieldname === 'tradeLicense' || file.fieldname === 'nidDocument') {
            cb(null, 'uploads/verification-docs/');
        } else if (file.fieldname === 'portfolioImage') {
            cb(null, 'uploads/portfolio/');
        } else {
            // All other uploads (image, profilePicture) go to main uploads folder
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|avif|pdf|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, avif, webp) and PDFs are allowed!'));
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB per file
    },
    fileFilter: fileFilter
});

// 🎯 Configure field uploaders for different routes

// For vendor signup - verification documents
const uploadVendorSignup = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'tradeLicense', maxCount: 1 },
    { name: 'nidDocument', maxCount: 1 }
]);

// 🎯 For vendor service creation - supports profile picture for photographers
const uploadVendorService = upload.fields([
    { name: 'image', maxCount: 10 },              // Service images (up to 10) → uploads/
    { name: 'profilePicture', maxCount: 1 },      // Profile picture for photographers → uploads/
]);

// For portfolio image upload
const uploadPortfolioImage = upload.single('portfolioImage'); // → uploads/portfolio/

// Export configured uploaders
module.exports = {
    upload,                    // Base uploader (for backward compatibility)
    uploadVendorSignup,        // For /auth/signup route → uploads/verification-docs/
    uploadVendorService,       // For /services/addservices route → uploads/
    uploadPortfolioImage,      // For portfolio uploads → uploads/portfolio/
};