const { default: mongoose } = require("mongoose");

const dbConnection = () => {
   mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.colj07f.mongodb.net/${process.env.DB_USERNAME}?appName=Cluster0`).then(() => {
       console.log("Database connected successfully");
   }).catch((err) => {
       console.log("Database connection failed", err);
   });
}

module.exports = dbConnection;