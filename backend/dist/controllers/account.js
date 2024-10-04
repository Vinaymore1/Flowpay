"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.getBalance = void 0;
const dotenv_1 = require("dotenv");
const db_1 = require("../db/db");
const types_1 = require("../types/types");
const Account_1 = __importDefault(require("../models/Account"));
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
(0, db_1.connectDB)();
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield Account_1.default.findOne({
            userId: req.userId,
        });
        if (!account) {
            return res.status(types_1.statusCode.notFound).json({
                message: "User with this account not found!",
            });
        }
        res.status(types_1.statusCode.success).json({
            message: "User found",
            balance: account.balance,
        });
    }
    catch (error) {
        console.error("Error fetching user's balance:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.getBalance = getBalance;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        //Transaction starting here
        session.startTransaction();
        const { to, amount } = req.body;
        const account = yield Account_1.default.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            yield session.abortTransaction();
            return res.status(types_1.statusCode.notAccepted).json({
                message: "Insufficient balance",
            });
        }
        const toAccount = yield Account_1.default.findOne({ userId: to }).session(session);
        if (!toAccount) {
            yield session.abortTransaction();
            return res.status(types_1.statusCode.notAccepted).json({
                message: "Invalid account",
            });
        }
        yield Account_1.default.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        yield Account_1.default.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        yield session.commitTransaction();
        res.status(types_1.statusCode.success).json({
            message: "Transfer Successful",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Error in transferring money:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.transfer = transfer;
