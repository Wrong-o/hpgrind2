"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizButton = void 0;
var react_1 = require("react");
var QuizButton = function (_a) {
    var text = _a.text, onClick = _a.onClick, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    return (react_1.default.createElement("button", { onClick: onClick, disabled: disabled, className: "\n        px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl \n        shadow-lg border border-teal-100 text-blue-600 font-bold\n        hover:bg-white/60 transition-all transform hover:scale-105\n        active:scale-95 disabled:hover:scale-100 disabled:hover:bg-white/50\n        ".concat(className, "\n      ") }, text));
};
exports.QuizButton = QuizButton;
