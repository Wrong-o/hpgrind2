"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomePopup = void 0;
var react_1 = require("react");
var WelcomePopup = function (_a) {
    var onStart = _a.onStart;
    return (react_1.default.createElement("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50" },
        react_1.default.createElement("div", { className: "bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center" },
            react_1.default.createElement("h2", { className: "text-2xl font-bold text-blue-600 mb-4" }, "V\u00E4lkommen!"),
            react_1.default.createElement("p", { className: "text-gray-600 mb-6" }, "Dina framsteg sparas nu"),
            react_1.default.createElement("button", { onClick: onStart, className: "px-6 py-3 bg-blue-600 text-white rounded-lg \n                   hover:bg-blue-700 transition-colors font-bold" }, "B\u00F6rja grinda"))));
};
exports.WelcomePopup = WelcomePopup;
