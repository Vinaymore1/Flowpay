"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateEnv_1 = __importDefault(require("../src/utils/validateEnv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const routes_1 = __importDefault(require("../src/routes"));
app.use((0, cors_1.default)({
    origin: validateEnv_1.default.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Jai Shri Ram ji");
});
app.listen(validateEnv_1.default.PORT, () => {
    console.log("Server running at port: ", validateEnv_1.default.PORT);
});
