"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCode = void 0;
var statusCode;
(function (statusCode) {
    statusCode[statusCode["success"] = 200] = "success";
    statusCode[statusCode["notFound"] = 404] = "notFound";
    statusCode[statusCode["internalError"] = 500] = "internalError";
    statusCode[statusCode["createdSucess"] = 201] = "createdSucess";
    statusCode[statusCode["notAccepted"] = 411] = "notAccepted";
    statusCode[statusCode["invalidCredentials"] = 401] = "invalidCredentials";
    statusCode[statusCode["authError"] = 403] = "authError";
})(statusCode || (exports.statusCode = statusCode = {}));
