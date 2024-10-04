"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const types_1 = require("../types/types");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.cookie;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(types_1.statusCode.authError).json({
            message: "Invalid token",
        });
    }
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split("=")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, validateEnv_1.default.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(types_1.statusCode.authError).json({
            message: "Auth error",
        });
    }
};
exports.default = authMiddleware;
