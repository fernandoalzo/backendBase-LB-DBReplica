const multer = require("multer");

function filesUploadsError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        console.log(err);
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
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
        error: "Ocurrió un error inesperado durante la carga del archivo.",
    });
}

module.exports = {
    filesUploadsError,
};