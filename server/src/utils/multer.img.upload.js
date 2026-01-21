const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Separate folders for different document types
        if (file.fieldname === 'tradeLicense' || file.fieldname === 'nidDocument') {
            cb(null, 'uploads/verification-docs/');
        } else {
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
    const allowedTypes = /jpeg|jpg|png|gif|avif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, avif) and PDFs are allowed!'));
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

module.exports = upload;