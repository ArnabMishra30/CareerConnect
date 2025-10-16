import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default protect;


// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTVhZDI4NTk1OTQxZjU5YzZkMTM3NyIsInJvbGUiOiJqb2ItcG9zdGVyIiwiaWF0IjoxNzU0NjM5OTgyLCJleHAiOjE3NTQ2NDM1ODJ9.Hwp8JAP8gRLC_IenhVx3mp6cHzJ3RnyWXKWrrT4J09A