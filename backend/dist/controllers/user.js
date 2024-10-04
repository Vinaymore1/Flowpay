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
exports.deleteUser = exports.bulk = exports.logout = exports.updateUser = exports.getUser = exports.login = exports.signup = void 0;
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const types_1 = require("../types/types");
const authTypes_1 = require("../types/authTypes");
const Account_1 = __importDefault(require("../models/Account"));
(0, db_1.connectDB)();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, firstName, lastName, password } = req.body;
        //zod input validation
        const { success } = authTypes_1.signupBody.safeParse(req.body);
        if (!success) {
            return res.status(types_1.statusCode.notAccepted).json({
                message: "Incorrect inputs",
            });
        }
        //checking for existing user
        const existingUser = yield User_1.default.findOne({
            username,
        });
        if (existingUser) {
            return res.status(types_1.statusCode.notAccepted).json({
                message: `User with email ${username} already exists!`,
            });
        }
        //hahsing the password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        //creating a new user
        const newUser = yield User_1.default.create({
            username,
            firstName,
            lastName,
            password: hashedPassword,
        });
        const userId = newUser._id;
        //creating an account for the user and giving them random amount of balance to start with
        const newAccount = yield Account_1.default.create({
            userId,
            balance: 1 + Math.random() * 10000,
        });
        const token = jsonwebtoken_1.default.sign({
            userId,
        }, validateEnv_1.default.JWT_SECRET);
        res.cookie("Bearer", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.json({
            message: "User created successfully",
            token: token,
            balance: newAccount,
        });
    }
    catch (error) {
        console.error("Error while signing up the user:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { success } = authTypes_1.loginBody.safeParse(req.body);
        if (!success) {
            return res.status(types_1.statusCode.notAccepted).json({
                message: "Incorrect inputs",
            });
        }
        const user = yield User_1.default.findOne({ username }).select("+password");
        if (!user) {
            return res
                .status(types_1.statusCode.notFound)
                .json({ message: "User does not exist" });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res
                .status(types_1.statusCode.invalidCredentials)
                .json({ message: "Invalid credentials" });
        }
        if (user) {
            const token = jsonwebtoken_1.default.sign({
                userId: user._id,
            }, validateEnv_1.default.JWT_SECRET, {
                expiresIn: "1d",
            });
            const userId = user._id.toString();
            // If password is valid, create user DTO(Data Transfer Object) without password to send it to the frontend
            const userDTO = {
                _id: userId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            res.cookie("Bearer", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            return res.json({
                token: token,
                userDTO,
                message: "Login successful",
            });
        }
        res.status(types_1.statusCode.notAccepted).json({
            message: "Error while logging in",
        });
    }
    catch (error) {
        console.error("Error logging in the user:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({
            _id: req.userId,
        });
        if (!user) {
            return res.status(types_1.statusCode.notFound).json({
                message: "User not found",
            });
        }
        res.status(types_1.statusCode.success).json({
            message: "User found",
            user,
        });
    }
    catch (error) {
        console.error("Error getting the user:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password } = req.body;
        //zod input validation
        const { success } = authTypes_1.updateBody.safeParse(req.body);
        if (!success) {
            return res.status(types_1.statusCode.notAccepted).json({
                message: "Error while updating information",
            });
        }
        // hash the password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Check if it's a test user
        const testUser = yield User_1.default.findOne({
            _id: req.userId,
        });
        if ((testUser === null || testUser === void 0 ? void 0 : testUser.username) === "user@gmail.com") {
            // If it's a test user, update only the firstName and lastName
            const updatedUser = yield User_1.default.findOneAndUpdate({ _id: req.userId }, // Query to find the user by userId
            { firstName, lastName }, // Updated fields
            { new: true } // Return the modified document
            );
            return res.status(types_1.statusCode.notAccepted).json({
                message: "The password cannot be updated on a test account!",
                user: updatedUser,
            });
        }
        // If not test user, Update the user info, including the hashed password
        const updatedUser = yield User_1.default.findOneAndUpdate({ _id: req.userId }, // Query to find the user by userId
        { firstName, lastName, password: hashedPassword }, // Updated fields, including the hashed password
        { new: true } // Return the modified document
        );
        if (!updatedUser) {
            return res.status(types_1.statusCode.notFound).json({
                message: "User not found",
            });
        }
        res.status(types_1.statusCode.success).json({
            message: "Updated Successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Error updating the user:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.updateUser = updateUser;
const logout = (req, res) => {
    try {
        // Clear the token cookie to log the user out
        res.clearCookie("Bearer");
        res.status(200).json({ message: "Logout Successful" });
    }
    catch (error) {
        console.error("Error logging out:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
};
exports.logout = logout;
const bulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    const currentUserId = req.userId;
    try {
        const users = yield User_1.default.find({
            $and: [
                {
                    _id: { $ne: currentUserId },
                },
                {
                    $or: [
                        {
                            firstName: {
                                $regex: filter,
                                $options: "i", // Case-insensitive option
                            },
                        },
                        {
                            lastName: {
                                $regex: filter,
                                $options: "i", // Case-insensitive option
                            },
                        },
                    ],
                },
            ],
        });
        const mappedUsers = users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }));
        res.status(types_1.statusCode.success).json({
            users: mappedUsers,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.bulk = bulk;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({
            _id: req.userId,
        });
        if (!user) {
            return res.status(types_1.statusCode.notFound).json({
                message: "User not found",
            });
        }
        if (user.username === "user@gmail.com") {
            return res.status(types_1.statusCode.notAccepted).json({
                message: "You are not allowed to delete a test account.",
            });
        }
        // Find and delete the associated account
        yield Account_1.default.findOneAndDelete({
            userId: user._id,
        });
        // Delete the user
        yield User_1.default.deleteOne({
            _id: user._id,
        });
        res.status(types_1.statusCode.success).json({
            message: "User and associated account deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(types_1.statusCode.internalError).json({
            message: "Internal server error",
        });
    }
});
exports.deleteUser = deleteUser;
