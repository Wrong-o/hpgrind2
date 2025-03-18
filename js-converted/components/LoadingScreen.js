"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScreen = void 0;
require("./LoadingScreen.css");
var LoadingScreen = function () {
    return (React.createElement("div", { className: "card" },
        React.createElement("div", { className: "loader" },
            React.createElement("p", null, "loading"),
            React.createElement("div", { className: "words" },
                React.createElement("span", { className: "word" }, "x+y"),
                React.createElement("span", { className: "word" }, "kx+m=y"),
                React.createElement("span", { className: "word" }, "a^2+b^2=c^2"),
                React.createElement("span", { className: "word" }, "P(A | B)")))));
};
exports.LoadingScreen = LoadingScreen;
