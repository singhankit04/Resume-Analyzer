import multer from 'multer'

const storage = multer.memoryStorage()

// File validation
const fileFilter = (req, file, cb) => {

    // Allow only PDFs
    if (file.mimetype === "application/pdf") {

        cb(null, true);

    } else {

        cb(new Error("Only PDF files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 }
})

export default upload;