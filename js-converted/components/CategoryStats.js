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
exports.CategoryStats = void 0;
var react_1 = require("react");
var AuthContext_1 = require("../contexts/AuthContext");
var CategoryStats = function (_a) {
    var onBack = _a.onBack;
    var _b = (0, react_1.useState)([]), stats = _b[0], setStats = _b[1];
    var token = (0, AuthContext_1.useAuth)().token;
    (0, react_1.useEffect)(function () {
        var fetchStats = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/user/category-stats"), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Accept': 'application/json',
                                },
                                credentials: 'include',
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3, 3];
                        return [4, response.json()];
                    case 2:
                        data = _a.sent();
                        setStats(data);
                        _a.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Failed to fetch category stats:', error_1);
                        return [3, 5];
                    case 5: return [2];
                }
            });
        }); };
        if (token) {
            fetchStats();
        }
    }, [token]);
    return (react_1.default.createElement("div", { className: "w-full max-w-4xl px-4 py-8 relative" },
        react_1.default.createElement("button", { onClick: onBack, className: "absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white \n                         rounded-lg hover:bg-blue-700 transition-colors" }, "Tillbaka"),
        react_1.default.createElement("div", { className: "space-y-4 mt-16" },
            react_1.default.createElement("h2", { className: "text-xl font-bold text-blue-600 mb-4 text-center" }, "Dina framsteg per kategori"),
            react_1.default.createElement("div", { className: "grid gap-4 md:grid-cols-2" }, stats.map(function (stat) { return (react_1.default.createElement("div", { key: stat.category_id, className: "bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg" },
                react_1.default.createElement("h3", { className: "font-bold text-lg mb-2" }, stat.category_name),
                react_1.default.createElement("div", { className: "space-y-2" },
                    react_1.default.createElement("div", { className: "flex justify-between" },
                        react_1.default.createElement("span", null, "Antal f\u00F6rs\u00F6k:"),
                        react_1.default.createElement("span", { className: "font-medium" }, stat.total_attempts)),
                    react_1.default.createElement("div", { className: "flex justify-between" },
                        react_1.default.createElement("span", null, "R\u00E4tta svar:"),
                        react_1.default.createElement("span", { className: "font-medium" }, stat.correct_attempts)),
                    react_1.default.createElement("div", { className: "flex justify-between" },
                        react_1.default.createElement("span", null, "Tr\u00E4ffs\u00E4kerhet:"),
                        react_1.default.createElement("span", { className: "font-medium" },
                            stat.accuracy,
                            "%")),
                    react_1.default.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
                        react_1.default.createElement("div", { className: "bg-blue-600 h-2.5 rounded-full transition-all duration-500", style: { width: "".concat(stat.accuracy, "%") } }))))); })))));
};
exports.CategoryStats = CategoryStats;
