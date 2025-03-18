"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var favicon_svg_react_1 = require("../assets/favicon.svg?react");
var AuthContext_1 = require("../contexts/AuthContext");
var Header = function (_a) {
    var onShowLogin = _a.onShowLogin;
    var isLoggedIn = (0, AuthContext_1.useAuth)().isLoggedIn;
    var handleDemoClick = function () {
        var featuresSection = document.querySelector('#features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    var handleHowItWorksClick = function () {
        var howItWorksSection = document.querySelector('#how-it-works');
        if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (react_1.default.createElement("header", { className: "bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md sticky top-0 z-50" },
        react_1.default.createElement("div", { className: "container mx-auto flex flex-col md:flex-row justify-between items-center" },
            react_1.default.createElement("div", { className: "flex items-center mb-4 md:mb-0" },
                react_1.default.createElement(favicon_svg_react_1.default, { className: "h-8 w-auto mr-3 fill-current text-white" }),
                react_1.default.createElement("h1", { className: "text-2xl font-bold" }, "HPGrind")),
            react_1.default.createElement("nav", null,
                react_1.default.createElement("ul", { className: "flex flex-wrap justify-center gap-3" },
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { onClick: handleDemoClick, className: "px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors" }, "Testa demo")),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { onClick: handleHowItWorksClick, className: "px-4 py-2 bg-transparent hover:bg-blue-500 text-white border border-white rounded-lg transition-colors" }, "Hur fungerar HPGrind")),
                    !isLoggedIn && (react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { onClick: onShowLogin, className: "px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors" }, "Skapa konto"))))))));
};
exports.default = Header;
