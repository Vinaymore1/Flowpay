"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../controllers/account");
const user_1 = __importDefault(require("../middlewares/user"));
const express_1 = require("express");
const accountRouter = (0, express_1.Router)();
accountRouter.get("/balance", user_1.default, account_1.getBalance);
accountRouter.post("/transfer", user_1.default, account_1.transfer);
exports.default = accountRouter;
