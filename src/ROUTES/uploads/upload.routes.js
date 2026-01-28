const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");

const UploadsServices = require("../../SERVICES/uploads/uploads.services");
const service = new UploadsServices();
const validatorHandler = require("../../MIDDLEWARES/validators/validator.handler");
const {
    imageNameSchema
} = require("../../SCHEMAS/uploads/uploads.schemas");

const { checkRole } = require("../../MIDDLEWARES/auth/checkRole.handler");
const { config } = require("../../CONFIG/config");
const { uploads } = require("../../MIDDLEWARES/uploads/filesUploads.handler");
const upload = uploads();

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    checkRole(config.userRoles.role1, config.userRoles.role2),
    upload.array("files", 5),
    async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                throw new Error("No se subieron archivos");
            }

            req.files = req.files.map((file) => {
                file.path = path.normalize(file.path).replace(/\\/g, "/");
                return file;
            });

            res.status(200).json({
                msg: "Archivos Cargado exitosamente",
                filesInfo: req.files,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/show/:imageName",
    passport.authenticate("jwt", { session: false }),
    checkRole(config.userRoles.role1, config.userRoles.role2),
    validatorHandler(imageNameSchema, "params"),
    async (req, res, next) => {
        try {
            const { imageName } = req.params;
            const { filePath } = await service.getFileStream(imageName);

            res.sendFile(filePath, (err) => {
                if (err) {
                    next(err);
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;