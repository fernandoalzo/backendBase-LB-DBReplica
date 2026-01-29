const multer = require("multer");
const path = require("path");

const { config } = require("../../CONFIG/config");
const logger = require("../../UTILS/logger");

// Function to sanitize the filename
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-z0-9\.\-]/gi, "_").toLowerCase();
}

function uploads({
    maxFileSize = config.fileSizeMB * 1024 * 1024,
} = {}) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, config.uploadsPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const sanitizedFileName = sanitizeFileName(file.originalname);
            logger.debug(`[filesUploads.handler.js] 📁 Processing file: ${file.originalname} -> ${uniqueSuffix}-${sanitizedFileName}`);
            cb(null, uniqueSuffix + "-" + sanitizedFileName);
        },
    });

    const fileFilter = (req, file, cb) => {
        const extname = config.allowedFilesToUpload.includes(
            path.extname(file.originalname).toLowerCase().slice(1)
        );
        const mimeType = config.allowedFilesToUpload.includes(
            file.mimetype.split("/")[1]
        );

        if (extname && mimeType) {
            cb(null, true);
        } else {
            logger.warn(`[filesUploads.handler.js] ⚠️ File rejected: ${file.originalname} (invalid type: ${file.mimetype})`);
            cb(
                new Error(
                    "Solo se permiten archivos de los tipos: " +
                    config.allowedFilesToUpload.join(", ")
                )
            );
        }
    };

    return multer({
        storage,
        limits: { fileSize: maxFileSize },
        fileFilter,
    });
}

module.exports = { uploads };