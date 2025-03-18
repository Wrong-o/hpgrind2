"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SecondChance = void 0;
var react_1 = require("react");
var AuthContext_1 = require("../contexts/AuthContext");
require("katex/dist/katex.min.css");
var react_katex_1 = require("@matejmazur/react-katex");
var formatQuestion = function (question) {
    var parts = question.split(/(\$[^$]+\$)/);
    return (react_1.default.createElement("div", { className: "space-y-6 text-center" },
        react_1.default.createElement("div", { className: "text-2xl py-4" }, parts.map(function (part, index) {
            if (part.startsWith('$') && part.endsWith('$')) {
                return react_1.default.createElement(react_katex_1.default, { key: index, math: part.slice(1, -1) });
            }
            return react_1.default.createElement("span", { key: index }, part);
        }))));
};
var SecondChance = function (_a) {
    var onBack = _a.onBack;
    var _b = (0, react_1.useState)([]), incorrectQuestions = _b[0], setIncorrectQuestions = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)({}), selectedAnswers = _d[0], setSelectedAnswers = _d[1];
    var _e = (0, react_1.useState)({}), showExplanation = _e[0], setShowExplanation = _e[1];
    var token = (0, AuthContext_1.useAuth)().token;
    (0, react_1.useEffect)(function () {
        var fetchIncorrectQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/user/history/incorrect"), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Accept': 'application/json',
                                },
                                credentials: 'include',
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to fetch incorrect questions');
                        }
                        return [4, response.json()];
                    case 2:
                        data = _a.sent();
                        setIncorrectQuestions(data);
                        return [3, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching incorrect questions:', error_1);
                        return [3, 5];
                    case 4:
                        setLoading(false);
                        return [7];
                    case 5: return [2];
                }
            });
        }); };
        fetchIncorrectQuestions();
    }, [token]);
    var handleAnswer = function (questionId, answer, question) { return __awaiter(void 0, void 0, void 0, function () {
        var questionData, attemptData, response, responseData, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedAnswers[questionId])
                        return [2];
                    setSelectedAnswers(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[questionId] = answer, _a)));
                    });
                    setShowExplanation(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[questionId] = true, _a)));
                    });
                    if (!(answer === question.correct_answer)) return [3, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    questionData = {
                        id: question.id,
                        subject: question.subject,
                        category: question.category,
                        moment: question.moment,
                        difficulty: question.difficulty,
                        question: question.question,
                        answers: question.answers,
                        correct_answer: question.correct_answer,
                        explanation: question.explanation
                    };
                    attemptData = {
                        subject: String(question.subject),
                        category: String(question.category),
                        moment: String(question.moment),
                        difficulty: Number(question.difficulty),
                        skipped: false,
                        time: 0,
                        is_correct: true,
                        question_data: JSON.stringify(questionData)
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    console.log('\n=== Frontend Debug ===');
                    console.log('Raw question data:', question);
                    console.log('Prepared question data:', questionData);
                    console.log('Attempt data:', attemptData);
                    console.log('Request body:', JSON.stringify(attemptData));
                    return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/attempts"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify(attemptData),
                        })];
                case 3:
                    response = _a.sent();
                    return [4, response.json()];
                case 4:
                    responseData = _a.sent();
                    if (!response.ok) {
                        console.log('\n=== Response Error ===');
                        console.log('Status:', response.status);
                        console.log('Status text:', response.statusText);
                        console.log('Response data:', responseData);
                        throw new Error("Failed to save attempt: ".concat(JSON.stringify(responseData)));
                    }
                    setTimeout(function () {
                        setIncorrectQuestions(function (prev) { return prev.filter(function (q) { return q.id !== questionId; }); });
                        setSelectedAnswers(function (prev) {
                            var newAnswers = __assign({}, prev);
                            delete newAnswers[questionId];
                            return newAnswers;
                        });
                        setShowExplanation(function (prev) {
                            var newExplanations = __assign({}, prev);
                            delete newExplanations[questionId];
                            return newExplanations;
                        });
                    }, 2000);
                    return [3, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error saving attempt:', error_2);
                    return [3, 6];
                case 6: return [3, 8];
                case 7:
                    error_3 = _a.sent();
                    console.error('Error saving attempt:', error_3);
                    return [3, 8];
                case 8: return [2];
            }
        });
    }); };
    if (loading) {
        return (react_1.default.createElement("div", { className: "flex items-center justify-center min-h-screen" },
            react_1.default.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" })));
    }
    if (incorrectQuestions.length === 0) {
        return (react_1.default.createElement("div", { className: "w-full max-w-4xl px-4 py-8 relative" },
            react_1.default.createElement("button", { onClick: onBack, className: "absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white \n                   rounded-lg hover:bg-blue-700 transition-colors" }, "Tillbaka"),
            react_1.default.createElement("div", { className: "text-center mt-16" },
                react_1.default.createElement("h2", { className: "text-2xl font-bold text-blue-600 mb-4" }, "Andra chansen"),
                react_1.default.createElement("p", { className: "text-xl text-teal-700" }, "Du har inga felaktiga svar att \u00F6va p\u00E5 just nu. Bra jobbat!"))));
    }
    return (react_1.default.createElement("div", { className: "w-full max-w-4xl px-4 py-8 relative" },
        react_1.default.createElement("button", { onClick: onBack, className: "absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white \n                 rounded-lg hover:bg-blue-700 transition-colors" }, "Tillbaka"),
        react_1.default.createElement("div", { className: "space-y-4 mt-16" },
            react_1.default.createElement("h2", { className: "text-2xl font-bold text-blue-600 mb-4 text-center" }, "Andra chansen"),
            react_1.default.createElement("div", { className: "grid gap-4" }, incorrectQuestions.map(function (question) { return (react_1.default.createElement("div", { key: question.id, className: "bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg" },
                react_1.default.createElement("div", { className: "text-sm text-teal-600 mb-2" },
                    question.moment,
                    " \u2022 Sv\u00E5righetsgrad ",
                    question.difficulty,
                    "/5"),
                react_1.default.createElement("div", { className: "text-lg text-blue-600 mb-4" }, formatQuestion(question.question)),
                react_1.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, question.answers.map(function (answer, index) { return (react_1.default.createElement("button", { key: index, onClick: function () { return handleAnswer(question.id, answer, question); }, disabled: !!selectedAnswers[question.id], className: "px-4 py-3 rounded-lg min-h-[80px]\n                             flex items-center justify-center transition-colors\n                             ".concat(selectedAnswers[question.id] === answer
                        ? answer === question.correct_answer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        : selectedAnswers[question.id]
                            ? 'bg-blue-500/50 text-white cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600') },
                    react_1.default.createElement("div", { className: "text-xl" },
                        react_1.default.createElement(react_katex_1.default, { math: answer.slice(1, -1) })))); })),
                showExplanation[question.id] && (react_1.default.createElement("div", { className: "mt-4 p-4 rounded-lg ".concat(selectedAnswers[question.id] === question.correct_answer
                        ? 'bg-green-100'
                        : 'bg-red-100') },
                    react_1.default.createElement("h3", { className: "font-bold mb-2 text-lg" }, selectedAnswers[question.id] === question.correct_answer
                        ? 'Bra jobbat!'
                        : 'Nästan rätt!'),
                    react_1.default.createElement("div", { className: "text-lg whitespace-pre-line" }, question.explanation.split(/(\$[^$]+\$)/).map(function (part, index) {
                        if (part.startsWith('$') && part.endsWith('$')) {
                            return react_1.default.createElement(react_katex_1.default, { key: index, math: part.slice(1, -1) });
                        }
                        return react_1.default.createElement("span", { key: index }, part);
                    })))))); })))));
};
exports.SecondChance = SecondChance;
