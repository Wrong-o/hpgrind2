"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculator = void 0;
var react_1 = require("react");
var SoundContext_1 = require("../contexts/SoundContext");
var Calculator = function (_a) {
    var onClose = _a.onClose;
    var isMuted = (0, SoundContext_1.useSound)().isMuted;
    var _b = (0, react_1.useState)('0'), display = _b[0], setDisplay = _b[1];
    var _c = (0, react_1.useState)(null), firstNumber = _c[0], setFirstNumber = _c[1];
    var _d = (0, react_1.useState)(null), operation = _d[0], setOperation = _d[1];
    var _e = (0, react_1.useState)(true), newNumber = _e[0], setNewNumber = _e[1];
    var _f = (0, react_1.useState)(''), expression = _f[0], setExpression = _f[1];
    var clickSound = (0, react_1.useCallback)(function () {
        if (isMuted)
            return;
        var audio = new Audio('/sounds/click.mp3');
        audio.volume = 0.3;
        audio.play();
    }, [isMuted]);
    var handleNumber = function (num) {
        clickSound();
        if (num === '.' && display.includes('.'))
            return;
        if (newNumber) {
            setDisplay(num === '.' ? '0.' : num);
            setNewNumber(false);
        }
        else {
            setDisplay(display + num);
        }
    };
    var handleOperator = function (op) {
        clickSound();
        var currentNumber = parseFloat(display);
        if (firstNumber === null) {
            setFirstNumber(currentNumber);
            setExpression("".concat(currentNumber, " ").concat(op, " "));
        }
        else {
            calculate();
            setFirstNumber(parseFloat(display));
            setExpression("".concat(display, " ").concat(op, " "));
        }
        setOperation(op);
        setNewNumber(true);
    };
    var calculate = function () {
        clickSound();
        if (firstNumber === null || operation === null)
            return;
        var secondNumber = parseFloat(display);
        var result = 0;
        switch (operation) {
            case '+':
                result = firstNumber + secondNumber;
                break;
            case '-':
                result = firstNumber - secondNumber;
                break;
            case '*':
                result = firstNumber * secondNumber;
                break;
            case '/':
                result = firstNumber / secondNumber;
                break;
        }
        setDisplay(result.toString());
        setExpression('');
        setFirstNumber(null);
        setOperation(null);
        setNewNumber(true);
    };
    var clear = function () {
        clickSound();
        setDisplay('0');
        setFirstNumber(null);
        setOperation(null);
        setNewNumber(true);
        setExpression('');
    };
    return (react_1.default.createElement("div", { className: "absolute right-4 top-20 bg-white/95 p-4 rounded-xl shadow-lg\n                 backdrop-blur-sm z-40 min-w-[240px]", onClick: function (e) { return e.stopPropagation(); } },
        react_1.default.createElement("div", { className: "bg-gray-100 p-2 rounded mb-1 text-right text-sm text-gray-600" }, expression || '\u00A0'),
        react_1.default.createElement("div", { className: "bg-gray-100 p-2 rounded mb-2 text-right text-xl font-bold" }, display),
        react_1.default.createElement("div", { className: "grid grid-cols-4 gap-2" }, [7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, '*', 'C', 0, '.', '=', '/'].map(function (btn, i) { return (react_1.default.createElement("button", { key: i, onClick: function () {
                if (typeof btn === 'number' || btn === '.')
                    handleNumber(btn.toString());
                else if (btn === '=')
                    calculate();
                else if (btn === 'C')
                    clear();
                else
                    handleOperator(btn);
            }, className: "\n              p-2 rounded text-lg font-bold transition-all duration-100\n              active:scale-95 active:brightness-90\n              ".concat(typeof btn === 'number' || btn === '.'
                ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800'
                : btn === 'C'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : btn === '='
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600', "\n              ").concat(operation === btn ? 'ring-2 ring-blue-300' : '', "\n            ") }, btn)); }))));
};
exports.Calculator = Calculator;
