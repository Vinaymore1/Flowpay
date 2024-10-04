"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBody = exports.loginBody = exports.signupBody = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupBody = zod_1.default.object({
    username: zod_1.default.string().email(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    password: zod_1.default.string(),
});
exports.loginBody = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
exports.updateBody = zod_1.default.object({
    password: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
});
