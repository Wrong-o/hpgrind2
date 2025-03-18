"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triangle = void 0;
var react_1 = require("react");
var Triangle = function (_a) {
    var a = _a.a, b = _a.b, c = _a.c, missingLabel = _a.missingLabel;
    var BASE_WIDTH = 200;
    var BASE_HEIGHT = 150;
    var points = {
        A: { x: 0, y: BASE_HEIGHT },
        B: { x: BASE_WIDTH, y: BASE_HEIGHT },
        C: { x: 0, y: 0 }
    };
    var padding = 40;
    var width = BASE_WIDTH + padding * 2;
    var height = BASE_HEIGHT + padding * 2;
    var labelPositions = {
        a: {
            x: -30,
            y: BASE_HEIGHT / 2
        },
        b: {
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT + 30
        },
        c: {
            x: BASE_WIDTH * 0.6,
            y: BASE_HEIGHT * 0.4
        }
    };
    var getSideValue = function (side) {
        var values = { a: a, b: b, c: c };
        var value = values[side];
        return side === missingLabel ? '?' : (value !== null ? value.toString() : '?');
    };
    return (react_1.default.createElement("div", { className: "relative flex justify-center mb-4" },
        react_1.default.createElement("svg", { width: width, height: height, viewBox: "".concat(-padding, " ").concat(-padding, " ").concat(width, " ").concat(height) },
            react_1.default.createElement("rect", { x: -padding, y: -padding, width: width, height: height, fill: "white", fillOpacity: "0.5", rx: "10" }),
            react_1.default.createElement("path", { d: "M ".concat(points.A.x + 20, " ").concat(points.A.y, " L ").concat(points.A.x, " ").concat(points.A.y, " L ").concat(points.A.x, " ").concat(points.A.y - 20), fill: "none", stroke: "currentColor", strokeWidth: "2.5" }),
            react_1.default.createElement("line", { x1: points.A.x, y1: points.A.y, x2: points.B.x, y2: points.B.y, stroke: missingLabel === 'b' ? '#ec4899' : 'currentColor', strokeWidth: "2.5", className: missingLabel === 'b' ? 'stroke-dashed' : '' }),
            react_1.default.createElement("line", { x1: points.A.x, y1: points.A.y, x2: points.C.x, y2: points.C.y, stroke: missingLabel === 'a' ? '#ec4899' : 'currentColor', strokeWidth: "2.5", className: missingLabel === 'a' ? 'stroke-dashed' : '' }),
            react_1.default.createElement("line", { x1: points.B.x, y1: points.B.y, x2: points.C.x, y2: points.C.y, stroke: missingLabel === 'c' ? '#ec4899' : 'currentColor', strokeWidth: "2.5", className: missingLabel === 'c' ? 'stroke-dashed' : '' }),
            ['a', 'b', 'c'].map(function (side) {
                var pos = labelPositions[side];
                var value = getSideValue(side);
                return (react_1.default.createElement("g", { key: side },
                    react_1.default.createElement("rect", { x: pos.x - 15, y: pos.y - 12, width: "30", height: "24", fill: "white", fillOpacity: "0.9", rx: "4" }),
                    react_1.default.createElement("text", { x: pos.x, y: pos.y, className: "fill-current text-base font-bold", textAnchor: "middle", dominantBaseline: "middle" }, value)));
            }))));
};
exports.Triangle = Triangle;
