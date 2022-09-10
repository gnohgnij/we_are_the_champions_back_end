const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://user:dbpassword@cluster0.apmmype.mongodb.net/?retryWrites=true&w=majority",
      () => {
        console.log(`Connected to MongoDB`);
      }
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
