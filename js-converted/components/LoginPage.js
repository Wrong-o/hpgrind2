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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
var react_1 = require("react");
var AuthContext_1 = require("../contexts/AuthContext");
var WelcomePopup_1 = require("./WelcomePopup");
var LoginPage = function (_a) {
    var onClose = _a.onClose;
    var _b = (0, react_1.useState)(true), isLogin = _b[0], setIsLogin = _b[1];
    var _c = (0, react_1.useState)(''), email = _c[0], setEmail = _c[1];
    var _d = (0, react_1.useState)(''), password = _d[0], setPassword = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(false), showWelcome = _f[0], setShowWelcome = _f[1];
    var _g = (0, AuthContext_1.useAuth)(), login = _g.login, register = _g.register;
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    if (!isLogin) return [3, 3];
                    return [4, login(email, password)];
                case 2:
                    _c.sent();
                    onClose();
                    return [3, 5];
                case 3: return [4, register(email, password)];
                case 4:
                    _c.sent();
                    setShowWelcome(true);
                    _c.label = 5;
                case 5: return [3, 7];
                case 6:
                    err_1 = _c.sent();
                    if ((_a = err_1.message) === null || _a === void 0 ? void 0 : _a.includes('already registered')) {
                        setError('Emailen har redan ett konto, försök att logga in istället');
                    }
                    else if ((_b = err_1.message) === null || _b === void 0 ? void 0 : _b.includes('minst')) {
                        setError("L\u00F6senordet \u00E4r inte starkt nog: ".concat(err_1.message));
                    }
                    else {
                        setError('Något gick fel. Om det håller i sig, kontakta supporten');
                    }
                    return [3, 7];
                case 7: return [2];
            }
        });
    }); };
    if (showWelcome) {
        return react_1.default.createElement(WelcomePopup_1.WelcomePopup, { onStart: onClose });
    }
    return (react_1.default.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" },
        react_1.default.createElement("div", { className: "bg-white rounded-xl p-8 max-w-md w-full mx-4 relative" },
            react_1.default.createElement("button", { onClick: onClose, className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700" }, "\u2715"),
            react_1.default.createElement("h2", { className: "text-2xl font-bold text-blue-600 mb-6" }, isLogin ? 'Logga in' : 'Skapa konto'),
            error && (react_1.default.createElement("div", { className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg" }, error)),
            react_1.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Email"),
                    react_1.default.createElement("input", { type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 \n                       focus:ring-blue-500 focus:border-blue-500", required: true })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "L\u00F6senord"),
                    react_1.default.createElement("input", { type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 \n                       focus:ring-blue-500 focus:border-blue-500", required: true }),
                    isLogin && (react_1.default.createElement("ul", { className: "list-disc list-inside" },
                        react_1.default.createElement("li", null, "Minst 8 tecken"),
                        react_1.default.createElement("li", null, "Minst en stor bokstav"),
                        react_1.default.createElement("li", null, "Minst en liten bokstav"),
                        react_1.default.createElement("li", null, "Minst en siffra"),
                        react_1.default.createElement("li", null,
                            "Minst ett specialtecken (!@#$%^&*(),.?\":",
                            "|<>)")))),
                react_1.default.createElement("button", { type: "submit", className: "w-full py-2 px-4 bg-blue-600 text-white rounded-lg \n                     hover:bg-blue-700 transition-colors" }, isLogin ? 'Logga in' : 'Skapa konto')),
            react_1.default.createElement("button", { onClick: function () {
                    setIsLogin(!isLogin);
                    setError(null);
                }, className: "mt-4 text-sm text-blue-600 hover:text-blue-800" }, isLogin ? 'Har du inget konto? Skapa ett här' : 'Har du redan ett konto? Logga in här'))));
};
exports.LoginPage = LoginPage;
