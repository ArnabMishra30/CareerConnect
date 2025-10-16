import express from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updateUserProfile, logoutUser } from "../controller/authController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadSingleFile.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, getAllUsers);
router.get("/user/:id", protect, getUserById);
router.put("/update-profile", protect,  upload.single("cv"), updateUserProfile);
router.post("/logout", protect, logoutUser); 

router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    role: req.user.role,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
});

export default router;