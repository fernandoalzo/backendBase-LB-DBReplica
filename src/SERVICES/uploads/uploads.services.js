const boom = require("@hapi/boom");
const path = require("path");
const fsSync = require("fs");

const { models } = require("../../LIBRARIES/db/sequelize");
const { config } = require("../../CONFIG/config");

class UploadsServices {

    async getFileStream(imageName) {
        const PROJECT_ROOT = path.resolve(process.cwd());
        const absolutePath = path.join(PROJECT_ROOT, config.uploadsPath, imageName);

        if (!fsSync.existsSync(absolutePath)) {
            throw boom.notFound("Documento no encontrado");
        }

        return {
            filePath: absolutePath,
            exists: true
        };
    }
}

module.exports = UploadsServices;