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
exports.Quiz = void 0;
var react_1 = require("react");
require("katex/dist/katex.min.css");
var react_katex_1 = require("@matejmazur/react-katex");
var DrawingBoard_1 = require("./DrawingBoard");
var Calculator_1 = require("./Calculator");
var SoundContext_1 = require("../contexts/SoundContext");
var AuthContext_1 = require("../contexts/AuthContext");
var LoadingScreen_1 = require("./LoadingScreen");
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
var getQuestionTypeLabel = function (type) {
    var labels = {
        'räknelagar': 'Räknelagar',
        'förlänga': 'Förlänga bråk',
        'förkorta': 'Förkorta bråk',
        'adda': 'Addera bråk',
        'multiplicera': 'Multiplicera bråk',
        'division': 'Division',
        'multiplikation': 'Multiplikation',
        'addition': 'Addition',
        'subtraktion': 'Subtraktion'
    };
    var lastPart = type.split('-').pop() || '';
    return labels[lastPart] || lastPart;
};
var Quiz = function (_a) {
    var _b, _c;
    var onComplete = _a.onComplete, testType = _a.testType, onBack = _a.onBack;
    var _d = (0, react_1.useState)(0), currentQuestion = _d[0], setCurrentQuestion = _d[1];
    var _e = (0, react_1.useState)([]), questions = _e[0], setQuestions = _e[1];
    var _f = (0, react_1.useState)(0), score = _f[0], setScore = _f[1];
    var _g = (0, react_1.useState)(null), selectedAnswer = _g[0], setSelectedAnswer = _g[1];
    var _h = (0, react_1.useState)(false), isAnswered = _h[0], setIsAnswered = _h[1];
    var _j = (0, react_1.useState)(120), timeLeft = _j[0], setTimeLeft = _j[1];
    var _k = (0, react_1.useState)(true), loading = _k[0], setLoading = _k[1];
    var _l = (0, react_1.useState)(null), error = _l[0], setError = _l[1];
    var _m = (0, react_1.useState)(false), showExplanation = _m[0], setShowExplanation = _m[1];
    var _o = (0, react_1.useState)(false), lastAnsweredCorrectly = _o[0], setLastAnsweredCorrectly = _o[1];
    var _p = (0, react_1.useState)(false), canProceed = _p[0], setCanProceed = _p[1];
    var _q = (0, react_1.useState)(false), showDrawingBoard = _q[0], setShowDrawingBoard = _q[1];
    var _r = (0, react_1.useState)(false), showCalculator = _r[0], setShowCalculator = _r[1];
    var _s = (0, SoundContext_1.useSound)(), isMuted = _s.isMuted, toggleMute = _s.toggleMute;
    var _t = (0, react_1.useState)(null), startTime = _t[0], setStartTime = _t[1];
    var _u = (0, AuthContext_1.useAuth)(), token = _u.token, refreshToken = _u.refreshToken;
    var _v = (0, react_1.useState)({
        'matematikbasic-räknelagar': { total: 0, completed: 0 },
        'matematikbasic-fraktioner-förlänga': { total: 0, completed: 0 },
        'matematikbasic-fraktioner-förkorta': { total: 0, completed: 0 },
        'matematikbasic-fraktioner-adda': { total: 0, completed: 0 },
        'matematikbasic-fraktioner-multiplicera': { total: 0, completed: 0 },
        'matematikbasic-ekvationslösning-division': { total: 0, completed: 0 },
        'matematikbasic-ekvationslösning-multiplikation': { total: 0, completed: 0 },
        'matematikbasic-ekvationslösning-addition': { total: 0, completed: 0 },
        'matematikbasic-ekvationslösning-subtraktion': { total: 0, completed: 0 }
    }), questionTypeCounts = _v[0], setQuestionTypeCounts = _v[1];
    var correctSound = new Audio('/sounds/correct.mp3');
    var wrongSound = new Audio('/sounds/wrong.mp3');
    correctSound.volume = isMuted ? 0 : 0.2;
    wrongSound.volume = isMuted ? 0 : 0.2;
    (0, react_1.useEffect)(function () {
        var fetchQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
            var allQuestions, i, questionResponse, questionData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        allQuestions = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < 12)) return [3, 6];
                        return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/question?type=").concat(testType))];
                    case 3:
                        questionResponse = _a.sent();
                        if (!questionResponse.ok) {
                            throw new Error('Failed to fetch questions');
                        }
                        return [4, questionResponse.json()];
                    case 4:
                        questionData = _a.sent();
                        allQuestions.push(questionData);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3, 2];
                    case 6:
                        setQuestions(allQuestions);
                        return [3, 8];
                    case 7:
                        err_1 = _a.sent();
                        setError('Failed to load questions. Please try again.');
                        console.error('Error fetching questions:', err_1);
                        return [3, 8];
                    case 8:
                        setLoading(false);
                        return [2];
                }
            });
        }); };
        fetchQuestions();
    }, [testType]);
    (0, react_1.useEffect)(function () {
        if (questions.length > 0) {
            setStartTime(new Date());
        }
    }, [currentQuestion, questions]);
    (0, react_1.useEffect)(function () {
        if (testType === 'MATEMATIKBASIC' && questions.length > 0) {
            var counts_1 = __assign({}, questionTypeCounts);
            questions.forEach(function (q) {
                if (counts_1[q.moment]) {
                    counts_1[q.moment].total++;
                }
            });
            setQuestionTypeCounts(counts_1);
        }
    }, [questions, testType]);
    var handleTokenError = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, refreshToken()];
                case 1:
                    _a.sent();
                    return [2, true];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to refresh token:', error_1);
                    return [2, false];
                case 3: return [2];
            }
        });
    }); };
    var handleAnswer = function (answer) { return __awaiter(void 0, void 0, void 0, function () {
        var normalizedAnswer, normalizedCorrectAnswer, isCorrect, timeTaken, currentQ, response, refreshed, error_2, currentMoment_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedAnswer = answer.trim();
                    normalizedCorrectAnswer = questions[currentQuestion].correct_answer.trim();
                    isCorrect = normalizedAnswer === normalizedCorrectAnswer;
                    setLastAnsweredCorrectly(isCorrect);
                    setShowExplanation(true);
                    setCanProceed(true);
                    if (isCorrect) {
                        correctSound.play();
                        setScore(score + 1);
                    }
                    else {
                        wrongSound.play();
                    }
                    if (!token) return [3, 7];
                    timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;
                    currentQ = questions[currentQuestion];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/attempts"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'Accept': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                subject: currentQ.subject,
                                category: currentQ.category,
                                moment: currentQ.moment,
                                difficulty: currentQ.difficulty,
                                skipped: false,
                                time: timeTaken,
                                is_correct: isCorrect
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!(response.status === 401)) return [3, 4];
                    return [4, handleTokenError()];
                case 3:
                    refreshed = _a.sent();
                    if (refreshed) {
                    }
                    return [3, 5];
                case 4:
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    _a.label = 5;
                case 5: return [3, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Failed to save attempt:', error_2);
                    return [3, 7];
                case 7:
                    if (testType === 'MATEMATIKBASIC') {
                        currentMoment_1 = questions[currentQuestion].moment;
                        setQuestionTypeCounts(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[currentMoment_1] = __assign(__assign({}, prev[currentMoment_1]), { completed: prev[currentMoment_1].completed + 1 }), _a)));
                        });
                    }
                    return [2];
            }
        });
    }); };
    var handleSkip = function () { return __awaiter(void 0, void 0, void 0, function () {
        var timeTaken, currentQ, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token) return [3, 4];
                    timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;
                    currentQ = questions[currentQuestion];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/attempts"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'Accept': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                subject: currentQ.subject,
                                category: currentQ.category,
                                moment: currentQ.moment,
                                difficulty: currentQ.difficulty,
                                skipped: true,
                                time: timeTaken,
                                is_correct: false
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [3, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Failed to save skip:', error_3);
                    return [3, 4];
                case 4:
                    handleNext();
                    return [2];
            }
        });
    }); };
    var handleNext = function () {
        if (currentQuestion === 11) {
            onComplete(score);
        }
        else {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplanation(false);
            setCanProceed(false);
        }
    };
    var getDifficultyStars = function (level) {
        return '★'.repeat(level) + '☆'.repeat(5 - level);
    };
    if (loading) {
        return react_1.default.createElement(LoadingScreen_1.LoadingScreen, null);
    }
    if (error || questions.length === 0) {
        return (react_1.default.createElement("div", { className: "text-xl text-red-600" },
            error || 'No questions available',
            react_1.default.createElement("button", { onClick: function () { return window.location.reload(); }, className: "block mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600" }, "Try Again")));
    }
    if (!questions[currentQuestion]) {
        return react_1.default.createElement(LoadingScreen_1.LoadingScreen, null);
    }
    return (react_1.default.createElement("div", { className: "w-full max-w-4xl p-4", onClick: function () { return setShowCalculator(false); } },
        react_1.default.createElement("div", { className: "fixed top-4 right-4 z-[60]" },
            react_1.default.createElement("button", { onClick: function (e) {
                    e.stopPropagation();
                    toggleMute();
                }, className: "p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors", title: isMuted ? "Aktivera ljud" : "Stäng av ljud" }, isMuted ? (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" }),
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" }))) : (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" }))))),
        react_1.default.createElement("div", { className: "fixed top-4 left-4 z-[60]" },
            react_1.default.createElement("button", { onClick: function (e) {
                    e.stopPropagation();
                    onBack();
                }, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" }, "Tillbaka")),
        react_1.default.createElement("div", { className: "fixed left-4 top-1/2 -translate-y-1/2 space-y-4 z-[60]" },
            react_1.default.createElement("button", { onClick: function (e) {
                    e.stopPropagation();
                    setShowDrawingBoard(true);
                }, className: "p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors", title: "Ritbr\u00E4da" },
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }))),
            react_1.default.createElement("button", { onClick: function (e) {
                    e.stopPropagation();
                    setShowCalculator(!showCalculator);
                }, className: "p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors", title: "Kalkylator" },
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" })))),
        showDrawingBoard && (react_1.default.createElement(DrawingBoard_1.DrawingBoard, { question: questions[currentQuestion].question, onClose: function () { return setShowDrawingBoard(false); }, currentQuestion: currentQuestion })),
        showCalculator && (react_1.default.createElement("div", { className: "fixed inset-0 flex items-center justify-center z-[70]", onClick: function () { return setShowCalculator(false); } },
            react_1.default.createElement("div", { onClick: function (e) { return e.stopPropagation(); } },
                react_1.default.createElement(Calculator_1.Calculator, { onClose: function () { return setShowCalculator(false); } })))),
        react_1.default.createElement("div", { className: "bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-teal-100" },
            react_1.default.createElement("div", { className: "flex justify-between items-center mb-6" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h2", { className: "text-2xl font-bold text-blue-600" },
                        testType,
                        " Test"),
                    react_1.default.createElement("div", { className: "text-sm text-teal-600" },
                        questions[currentQuestion].moment,
                        " \u2022",
                        react_1.default.createElement("span", { className: "text-yellow-500 ml-2", title: "Sv\u00E5righetsgrad ".concat(questions[currentQuestion].difficulty, "/5") }, getDifficultyStars(questions[currentQuestion].difficulty)))),
                react_1.default.createElement("div", { className: "text-lg font-medium text-teal-700" },
                    "Fr\u00E5ga ",
                    currentQuestion + 1,
                    "/12")),
            react_1.default.createElement("div", { className: "mb-4 text-right text-pink-600" },
                "Score: ",
                score),
            testType === 'MATEMATIKBASIC' && (react_1.default.createElement("div", { className: "mb-6" },
                react_1.default.createElement("h3", { className: "text-lg font-semibold text-blue-600 mb-2" }, "Framsteg per omr\u00E5de:"),
                react_1.default.createElement("div", { className: "grid grid-cols-2 gap-3" }, Object.entries(questionTypeCounts).map(function (_a) {
                    var type = _a[0], count = _a[1];
                    return (react_1.default.createElement("div", { key: type, className: "flex justify-between items-center rounded-lg p-3 \n                    ".concat(count.completed > 0 ? 'bg-blue-50' : 'bg-white/50') },
                        react_1.default.createElement("span", { className: "text-sm font-medium text-gray-700" }, getQuestionTypeLabel(type)),
                        react_1.default.createElement("div", { className: "flex items-center gap-2" },
                            react_1.default.createElement("div", { className: "h-2 w-16 bg-gray-200 rounded-full overflow-hidden" },
                                react_1.default.createElement("div", { className: "h-full bg-blue-600 transition-all duration-300", style: {
                                        width: "".concat(count.total > 0 ? (count.completed / count.total) * 100 : 0, "%")
                                    } })),
                            react_1.default.createElement("span", { className: "text-sm font-medium text-blue-600 min-w-[3ch] text-right" },
                                count.completed,
                                "/",
                                count.total))));
                })))),
            react_1.default.createElement("div", { className: "bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50" },
                react_1.default.createElement("div", { className: "text-2xl text-pink-600 mb-8" }, formatQuestion(((_b = questions[currentQuestion]) === null || _b === void 0 ? void 0 : _b.question) || '')),
                react_1.default.createElement("div", { className: "grid grid-cols-2 gap-6" }, (_c = questions[currentQuestion]) === null || _c === void 0 ? void 0 : _c.answers.map(function (option, index) { return (react_1.default.createElement("button", { key: index, onClick: function () { return handleAnswer(option); }, className: "px-6 py-4 bg-blue-500 text-white rounded-lg \n                          hover:bg-blue-600 transition-colors min-h-[80px]\n                          flex items-center justify-center\n                          ".concat(showExplanation ? 'cursor-not-allowed opacity-75' : ''), disabled: showExplanation },
                    react_1.default.createElement("div", { className: "text-xl" },
                        react_1.default.createElement(react_katex_1.default, { math: option.slice(1, -1) })))); }))),
            react_1.default.createElement("button", { onClick: handleSkip, className: "mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 \n                    transition-colors text-sm underline" }, "Klicka h\u00E4r ist\u00E4llet f\u00F6r att chansa"),
            showExplanation && (react_1.default.createElement("div", { className: "mt-6" },
                react_1.default.createElement("div", { className: "p-6 rounded-lg ".concat(lastAnsweredCorrectly ? 'bg-green-100' : 'bg-red-100') },
                    react_1.default.createElement("h3", { className: "font-bold mb-4 text-xl" }, lastAnsweredCorrectly ? 'Bra jobbat!' : 'Nästan rätt!'),
                    react_1.default.createElement("div", { className: "text-lg whitespace-pre-line" }, questions[currentQuestion].explanation.split(/(\$[^$]+\$)/).map(function (part, index) {
                        if (part.startsWith('$') && part.endsWith('$')) {
                            return react_1.default.createElement(react_katex_1.default, { key: index, math: part.slice(1, -1) });
                        }
                        return react_1.default.createElement("span", { key: index }, part);
                    }))),
                canProceed && (react_1.default.createElement("div", { className: "mt-4 flex justify-end" },
                    react_1.default.createElement("button", { onClick: handleNext, className: "px-6 py-2 bg-blue-600 text-white rounded-lg \n                           hover:bg-blue-700 transition-colors" }, currentQuestion === 11 ? 'Se resultat' : 'Nästa fråga'))))))));
};
exports.Quiz = Quiz;
