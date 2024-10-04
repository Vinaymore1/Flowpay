"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../middlewares/user"));
const user_2 = require("../controllers/user");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", user_2.signup);
userRouter.post("/login", user_2.login);
userRouter.post("/logout", user_1.default, user_2.logout);
userRouter.get("/", user_1.default, user_2.getUser);
userRouter.put("/updateuser", user_1.default, user_2.updateUser);
userRouter.get("/bulk", user_1.default, user_2.bulk);
userRouter.delete("/deleteuser", user_1.default, user_2.deleteUser);
exports.default = userRouter;
