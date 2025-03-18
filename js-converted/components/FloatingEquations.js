"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingEquations = void 0;
var react_1 = require("react");
var equations = [
    'x²',
    '∑',
    '∫',
    'π',
    '√',
    '±',
    '÷',
    '∞',
    'θ',
    'Δ',
    'μ',
    'σ',
    '%',
    '≈',
    'XYZ'
];
var FloatingEquations = function () {
    return (react_1.default.createElement(react_1.default.Fragment, null, equations.map(function (equation, i) {
        var leftPosition = Math.floor(Math.random() * 100);
        return (react_1.default.createElement("div", { key: i, style: { left: "".concat(leftPosition, "%") }, className: "\n              absolute animate-float\n              text-blue-500/20 font-bold\n              ".concat(getRandomDelay(), "\n              ").concat(getRandomSize(), "\n              select-none\n            ") }, equation));
    })));
};
exports.FloatingEquations = FloatingEquations;
var getRandomDelay = function () {
    var delays = [
        'animation-delay-0',
        'animation-delay-1000',
        'animation-delay-2000',
        'animation-delay-3000',
        'animation-delay-4000',
    ];
    return delays[Math.floor(Math.random() * delays.length)];
};
var getRandomSize = function () {
    var sizes = ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'];
    return sizes[Math.floor(Math.random() * sizes.length)];
};
