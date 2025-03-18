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
exports.XYZStats = void 0;
var react_1 = require("react");
var AuthContext_1 = require("../contexts/AuthContext");
var XYZStats = function () {
    var _a = (0, react_1.useState)([]), stats = _a[0], setStats = _a[1];
    var token = (0, AuthContext_1.useAuth)().token;
    (0, react_1.useEffect)(function () {
        var fetchStats = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/xyz/stats"), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4, response.json()];
                    case 2:
                        data = _a.sent();
                        setStats(data);
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to fetch XYZ stats:', error_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); };
        fetchStats();
    }, [token]);
    return (react_1.default.createElement("div", { className: "grid gap-4" }, stats.map(function (stat, index) { return (react_1.default.createElement("div", { key: index, className: "bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg\n                     hover:bg-white/60 transition-all cursor-pointer" },
        react_1.default.createElement("h3", { className: "text-xl font-bold text-blue-600 mb-2" }, stat.subcategory),
        react_1.default.createElement("div", { className: "grid grid-cols-3 gap-4 text-sm" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "text-gray-600" }, "Korrekt"),
                react_1.default.createElement("div", { className: "text-2xl font-bold text-green-600" },
                    stat.correct_percentage,
                    "%")),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "text-gray-600" }, "Snitt tid"),
                react_1.default.createElement("div", { className: "text-2xl font-bold text-blue-600" },
                    Math.round(stat.average_time),
                    "s")),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "text-gray-600" }, "Antal fr\u00E5gor"),
                react_1.default.createElement("div", { className: "text-2xl font-bold text-purple-600" }, stat.total_questions))))); })));
};
exports.XYZStats = XYZStats;
