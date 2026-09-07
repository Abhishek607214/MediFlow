const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user.model");

require("dotenv").config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            email: "admin@mediflow.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            12
        );

        const admin = await User.create({
            name: "MediFlow Admin",
            email: "admin@mediflow.com",
            password: hashedPassword,
            phone: "",
            role: "admin",
            isActive: true
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);

        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();