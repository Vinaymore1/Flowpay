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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const MONGO_URL = validateEnv_1.default.MONGO_URL;
            if (!MONGO_URL) {
                throw new Error("MONGO_URL environment variable is not defined.");
            }
            yield mongoose_1.default.connect(MONGO_URL);
            const connection = mongoose_1.default.connection;
            connection.on("connected", () => {
                console.log("Mongodb connected succesfully");
            });
            connection.on("error", (err) => {
                console.log("Mongodb connection error" + err);
                process.exit(1);
            });
        }
        catch (error) {
            console.log("Mongodb connection error" + error);
        }
    });
}
exports.connectDB = connectDB;
