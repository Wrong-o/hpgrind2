"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingBoard = void 0;
var react_1 = require("react");
var DrawingBoard = function (_a) {
    var question = _a.question, onClose = _a.onClose, currentQuestion = _a.currentQuestion;
    var canvasRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), isDrawing = _b[0], setIsDrawing = _b[1];
    var _c = (0, react_1.useState)(null), context = _c[0], setContext = _c[1];
    var _d = (0, react_1.useState)({ x: 0, y: 0 }), lastPosition = _d[0], setLastPosition = _d[1];
    var _e = (0, react_1.useState)('white'), color = _e[0], setColor = _e[1];
    var _f = (0, react_1.useState)(2), lineWidth = _f[0], setLineWidth = _f[1];
    var _g = (0, react_1.useState)(false), isMinimized = _g[0], setIsMinimized = _g[1];
    (0, react_1.useEffect)(function () {
        initCanvas();
    }, []);
    (0, react_1.useEffect)(function () {
        clearCanvas();
    }, [currentQuestion]);
    var initCanvas = function () {
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        setContext(ctx);
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    (0, react_1.useEffect)(function () {
        if (context) {
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);
    var startDrawing = function (e) {
        if (!context)
            return;
        setIsDrawing(true);
        var pos = getMousePos(e);
        setLastPosition(pos);
    };
    var draw = function (e) {
        if (!isDrawing || !context)
            return;
        var pos = getMousePos(e);
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(pos.x, pos.y);
        context.stroke();
        setLastPosition(pos);
    };
    var getMousePos = function (e) {
        var canvas = canvasRef.current;
        if (!canvas)
            return { x: 0, y: 0 };
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    var clearCanvas = function () {
        if (!context || !canvasRef.current)
            return;
        context.fillStyle = '#1a1a1a';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };
    var handleBackgroundClick = function (e) {
        if (e.target === e.currentTarget) {
            setIsMinimized(true);
        }
    };
    return (react_1.default.createElement("div", { className: "fixed inset-x-0 bottom-0 bg-black/90 z-50\n                 rounded-t-3xl shadow-2xl transform transition-all duration-300\n                 border-t border-white/20 ".concat(isMinimized
            ? 'h-16 cursor-pointer'
            : 'h-[80vh]'), onClick: isMinimized ? function () { return setIsMinimized(false); } : handleBackgroundClick }, isMinimized ? (react_1.default.createElement("div", { className: "flex items-center justify-between px-4 h-full" },
        react_1.default.createElement("p", { className: "text-white text-sm truncate" }, question),
        react_1.default.createElement("span", { className: "text-white/50 text-sm" }, "Klicka f\u00F6r att \u00F6ppna"))) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "absolute top-4 left-0 right-0 px-4 flex justify-between items-start" },
            react_1.default.createElement("div", { className: "bg-white/10 p-4 rounded-lg cursor-pointer\n                       hover:bg-white/20 transition-colors max-w-md", onClick: onClose },
                react_1.default.createElement("p", { className: "text-white text-sm" }, question)),
            react_1.default.createElement("div", { className: "flex gap-2" },
                ['white', '#ff4444', '#44ff44', '#4444ff', '#ffff44'].map(function (c) { return (react_1.default.createElement("button", { key: c, onClick: function () { return setColor(c); }, className: "w-8 h-8 rounded-full border-2 ".concat(color === c ? 'border-white' : 'border-transparent'), style: { backgroundColor: c } })); }),
                react_1.default.createElement("select", { value: lineWidth, onChange: function (e) { return setLineWidth(Number(e.target.value)); }, className: "bg-white/10 text-white rounded px-2" },
                    react_1.default.createElement("option", { value: "2" }, "Thin"),
                    react_1.default.createElement("option", { value: "4" }, "Medium"),
                    react_1.default.createElement("option", { value: "8" }, "Thick")),
                react_1.default.createElement("button", { onClick: clearCanvas, className: "px-4 py-2 bg-red-500/50 text-white rounded\n                         hover:bg-red-500/70 transition-colors" }, "Rensa"))),
        react_1.default.createElement("div", { className: "flex justify-center items-center h-full pt-16" },
            react_1.default.createElement("canvas", { ref: canvasRef, onMouseDown: startDrawing, onMouseMove: draw, onMouseUp: function () { return setIsDrawing(false); }, onMouseLeave: function () { return setIsDrawing(false); }, className: "rounded-lg border border-white/10" }))))));
};
exports.DrawingBoard = DrawingBoard;
