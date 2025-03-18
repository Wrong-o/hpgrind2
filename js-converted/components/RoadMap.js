"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadMap = void 0;
var react_1 = require("react");
var react_zoom_pan_pinch_1 = require("react-zoom-pan-pinch");
var RoadMap = function () {
    var topics = [
        {
            title: 'Arrays & Hashing',
            progress: 75,
            children: [
                {
                    title: 'Two Pointers',
                    progress: 60,
                    children: [
                        {
                            title: 'Sliding Window',
                            progress: 40
                        },
                        {
                            title: 'Linked List',
                            progress: 50
                        },
                        {
                            title: 'Binary Search',
                            progress: 30
                        }
                    ]
                },
                {
                    title: 'Stack',
                    progress: 45
                }
            ]
        }
    ];
    var renderProgressBar = function (progress) { return (react_1.default.createElement("div", { className: "h-2 w-full bg-gray-200 rounded-full overflow-hidden" },
        react_1.default.createElement("div", { className: "h-full bg-green-500 transition-all duration-500", style: { width: "".concat(progress, "%") } }))); };
    var renderNode = function (node, level) {
        if (level === void 0) { level = 0; }
        return (react_1.default.createElement("div", { key: node.title, className: "relative ".concat(level > 0 ? 'ml-12' : '') },
            react_1.default.createElement("div", { className: "bg-blue-600 rounded-xl p-4 shadow-lg mb-4 w-64" },
                react_1.default.createElement("h3", { className: "text-white font-bold mb-2" }, node.title),
                renderProgressBar(node.progress)),
            node.children && node.children.map(function (child, index) { return (react_1.default.createElement("div", { key: child.title, className: "relative" },
                react_1.default.createElement("div", { className: "absolute -left-8 top-0 w-8 h-[50%] border-l-2 border-t-2 border-white" }),
                renderNode(child, level + 1))); })));
    };
    return (react_1.default.createElement("div", { className: "fixed inset-0 flex items-center justify-center" },
        react_1.default.createElement("div", { className: "w-[80%] h-[80%] bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl shadow-2xl overflow-hidden p-8" },
            react_1.default.createElement("h1", { className: "text-3xl font-bold mb-8 text-center text-white" }, "Dina framsteg"),
            react_1.default.createElement(react_zoom_pan_pinch_1.TransformWrapper, { initialScale: 1, minScale: 0.5, maxScale: 2, centerOnInit: true, wheel: { step: 0.1 } }, function (_a) {
                var zoomIn = _a.zoomIn, zoomOut = _a.zoomOut, resetTransform = _a.resetTransform;
                return (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", { className: "absolute top-4 right-4 space-x-2 z-10" },
                        react_1.default.createElement("button", { onClick: function () { return zoomIn(); }, className: "bg-white/10 hover:bg-white/20 text-white rounded-lg p-2" },
                            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }))),
                        react_1.default.createElement("button", { onClick: function () { return zoomOut(); }, className: "bg-white/10 hover:bg-white/20 text-white rounded-lg p-2" },
                            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }))),
                        react_1.default.createElement("button", { onClick: function () { return resetTransform(); }, className: "bg-white/10 hover:bg-white/20 text-white rounded-lg p-2" },
                            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })))),
                    react_1.default.createElement(react_zoom_pan_pinch_1.TransformComponent, { wrapperClass: "!w-full !h-full", contentClass: "!w-full !h-full flex items-center justify-center" },
                        react_1.default.createElement("div", { className: "relative" }, topics.map(function (topic) { return renderNode(topic); })))));
            }))));
};
exports.RoadMap = RoadMap;
