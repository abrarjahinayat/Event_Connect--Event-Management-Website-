const mongoose = require("mongoose");

const dbconnection = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ ERROR: MONGODB_URI is not defined');
            throw new Error('MONGODB_URI environment variable is required');
        }

        console.log('🔄 Attempting to connect to MongoDB...');
        
        // ✅ REMOVE the deprecated options
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ Database connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('⚠️  Server will continue without database connection');
    }
};

mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from database');
});

module.exports = dbconnection;