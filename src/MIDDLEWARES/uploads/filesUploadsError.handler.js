const multer = require("multer");
const logger = require("../../UTILS/logger");

function filesUploadsError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        logger.error(`[filesUploadsError.handler.js] ❌ Multer Error [${err.code}]: ${err.message}`);
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({
                    error: "Un archivo excede el tamaña máximo permitido.",
                });
            case "LIMIT_UNEXPECTED_FILE":
                return res.status(400).json({
                    error: "Solo se permite cargar 5 archivos a la vez.",
                });
            default:
                return res.status(400).json({
                    error: err,
                });
        }
    }

    if (err.message) {
        logger.warn(`[filesUploadsError.handler.js] ⚠️ File upload error: ${err.message}`);
        return res.status(400).json({ error: err.message });
    }

    logger.error("[filesUploadsError.handler.js] ❌ Unexpected file upload error");
    res.status(500).json({
        error: "Ocurrió un error inesperado durante la carga del archivo.",
    });
}

module.exports = {
    filesUploadsError,
};