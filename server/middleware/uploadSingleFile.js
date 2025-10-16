// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // store in local /uploads/ folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// export default upload;















import multer from "multer";

const storage = multer.memoryStorage(); // No disk storage
const upload = multer({ storage });

export default upload;
