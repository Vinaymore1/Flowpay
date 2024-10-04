"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const env = (0, envalid_1.cleanEnv)(process.env, {
    MONGO_URL: (0, validators_1.str)(),
    PORT: (0, validators_1.port)(),
    JWT_SECRET: (0, validators_1.str)(),
    FRONTEND_URL: (0, validators_1.str)()
});
exports.default = env;
