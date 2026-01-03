import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // 🔥 THIS IS THE FIX
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["application/pdf"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

export default upload;
