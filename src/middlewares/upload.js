import multer from "multer";
import path from "path";
import fs from "fs";

// Tentukan lokasi penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/";

        // Buat folder kalau belum ada
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Ambil ekstensi (misal .png)
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

// Filter file agar hanya gambar yang diterima
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only .jpg, .png, .webp files are allowed!"), false);
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
});
