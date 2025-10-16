
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
// import fs from "fs";
import streamifier from "streamifier";

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ firstName, lastName, email, password, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(201).json({ message: "Token generated", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// const registerUser = async (req, res) => {
//     const { firstName, lastName, email, password, role } = req.body;
//     try {
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const user = new User({ firstName, lastName, email, password, role });
//         await user.save();

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//         });

//         res.status(201).json({ message: "Token generated", token });
//     } catch (err) {
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await user.matchPassword(password))) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//         });

//         res.status(200).json({ token });
//     } catch (err) {
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "job-poster") {
            return res.status(403).json({ message: "Access denied: Only job posters can view all users." });
        }

        const users = await User.find().select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


//update user profile
// const updateUserProfile = async (req, res) => {
//     try {
//         const userId = req.user.id; // from JWT middleware
//         const user = await User.findById(userId);

//         if (!user) return res.status(404).json({ message: "User not found" });

//         if (user.role !== "job-seeker") {
//             return res.status(403).json({ message: "Only job seekers can update profile info" });
//         }

//         // Allow updating these fields only
//         const { phone, location, education, experience, skills, githubLink } = req.body;

//         user.phone = phone ?? user.phone;
//         user.location = location ?? user.location;
//         user.education = education ?? user.education;
//         user.experience = experience ?? user.experience;
//         user.skills = skills ?? user.skills;
//         user.githubLink = githubLink ?? user.githubLink;

//         const updatedUser = await user.save();

//         res.status(200).json({
//             message: "Profile updated successfully",
//             user: {
//                 firstName: updatedUser.firstName,
//                 lastName: updatedUser.lastName,
//                 email: updatedUser.email,
//                 phone: updatedUser.phone,
//                 location: updatedUser.location,
//                 education: updatedUser.education,
//                 experience: updatedUser.experience,
//                 skills: updatedUser.skills,
//                 githubLink: updatedUser.githubLink,
//                 role: updatedUser.role,
//             }
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role !== "job-seeker") {
            return res.status(403).json({ message: "Only job seekers can update their profile." });
        }

        const { phone, location, education, experience, skills, githubLink } = req.body;

        user.phone = phone ?? user.phone;
        user.location = location ?? user.location;
        user.education = education ?? user.education;
        user.experience = experience ?? user.experience;
        user.skills = skills ?? user.skills;
        user.githubLink = githubLink ?? user.githubLink;

        // ✅ Upload CV directly from memory if provided
        if (req.file) {
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "cvs", resource_type: "raw" },
                    (error, result) => {
                        if (error) return reject(error);
                        user.cvUrl = result.secure_url;
                        resolve();
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location: updatedUser.location,
                education: updatedUser.education,
                experience: updatedUser.experience,
                skills: updatedUser.skills,
                githubLink: updatedUser.githubLink,
                cvUrl: updatedUser.cvUrl,
                role: updatedUser.role,
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export default updateUserProfile;

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), //expires immediately
  });
  res.status(200).json({ message: "Logged out successfully" });
};


export { registerUser, loginUser, getAllUsers, getUserById, updateUserProfile, logoutUser };
