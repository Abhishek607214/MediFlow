const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }

        // Validate role
        const selectedRole = role || "patient";

        if (
            selectedRole !== "patient" &&
            selectedRole !== "doctor" &&
            selectedRole !== "receptionist"
        ) {
            return res.status(400).json({
                success: false,
                message:
                   "Registration is allowed only for patients, doctors and receptionists"
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        // Normalize email
        const normalizedEmail =
            email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 12);

        // Create User
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone || "",
            role: selectedRole
        });

        // Create corresponding profile
        if (selectedRole === "patient") {

            await Patient.create({
                user: user._id
            });

        } else if (selectedRole === "doctor") {

            await Doctor.create({
                user: user._id,
                specialization: "General Physician"
            });
        }

        // Send response without password
        return res.status(201).json({
            success: true,
            message:
                selectedRole === "doctor"
                    ? "Doctor registered successfully"
                    : "Patient registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during registration",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        
        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }
        
        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        
        // Store token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error("Get me error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during logout"
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout
};
