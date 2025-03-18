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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPage = void 0;
var react_1 = require("react");
var VideoPlayer_1 = require("./VideoPlayer");
var AuthContext_1 = require("../contexts/AuthContext");
var LandingPage = function (_a) {
    var onShowLogin = _a.onShowLogin;
    var _b = (0, react_1.useState)({}), videoError = _b[0], setVideoError = _b[1];
    var isLoggedIn = (0, AuthContext_1.useAuth)().isLoggedIn;
    var handleVideoError = function (videoId) {
        setVideoError(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[videoId] = true, _a)));
        });
    };
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
    return (react_1.default.createElement("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100" },
        react_1.default.createElement("section", { className: "relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" },
            react_1.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" },
                react_1.default.createElement("div", { className: "space-y-6" },
                    react_1.default.createElement("h1", { className: "text-4xl sm:text-5xl font-bold text-gray-900" }, "H\u00F6gskoleprovet utan bullshit, bara resultat"),
                    react_1.default.createElement("p", { className: "text-xl text-gray-600" },
                        "Din tid \u00E4r viktig. HPGrind ser till att varje minut l\u00E4ggs p\u00E5 att f\u00F6rb\u00E4ttra dina resultat:",
                        react_1.default.createElement("ul", null,
                            react_1.default.createElement("li", null, "- Genv\u00E4gar p\u00E5 matten ist\u00E4llet f\u00F6r l\u00E5nga genomg\u00E5ngar"),
                            react_1.default.createElement("li", null, "- Personligt anpassade uppgifter f\u00F6r att maximera resultat"),
                            react_1.default.createElement("li", null, "- F\u00F6rklaringar utan on\u00F6digt sv\u00E5ra ord"))),
                    react_1.default.createElement("div", { className: "flex flex-col sm:flex-row gap-4" },
                        react_1.default.createElement("button", { onClick: handleDemoClick, className: "px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors" }, "Testa demo"),
                        react_1.default.createElement("button", { onClick: handleHowItWorksClick, className: "px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors" }, "Hur fungerar HPGrind"))),
                react_1.default.createElement("div", { className: "rounded-lg overflow-hidden shadow-xl" }, videoError['intro'] ? (react_1.default.createElement("div", { className: "w-full aspect-video bg-gray-200 flex items-center justify-center" },
                    react_1.default.createElement("p", { className: "text-gray-500 text-center p-4" }, "Introduktionsvideo kommer snart"))) : (react_1.default.createElement(VideoPlayer_1.VideoPlayer, { src: "/videos/FractionDivision.mp4", poster: "/images/intro-poster.jpg", autoPlay: true, loop: true, muted: true, controls: false, className: "w-full aspect-video", onError: function () { return handleVideoError('intro'); } }))))),
        react_1.default.createElement("section", { id: "features", className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20" },
            react_1.default.createElement("div", { className: "text-center mb-16" },
                react_1.default.createElement("h2", { className: "text-3xl font-bold text-gray-900" }, "Hur HPGrind hj\u00E4lper dig"),
                react_1.default.createElement("p", { className: "mt-4 text-xl text-gray-600 max-w-3xl mx-auto" }, "Se hur v\u00E5ra verktyg och metoder kan hj\u00E4lpa dig att n\u00E5 dina m\u00E5l p\u00E5 h\u00F6gskoleprovet.")),
            react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
                react_1.default.createElement("div", { className: "bg-white rounded-lg shadow-md overflow-hidden" },
                    videoError['feature1'] ? (react_1.default.createElement("div", { className: "w-full aspect-video bg-gray-100 flex items-center justify-center" },
                        react_1.default.createElement("p", { className: "text-gray-500 text-center p-4" }, "Video om personlig tr\u00E4ningsplan"))) : (react_1.default.createElement(VideoPlayer_1.VideoPlayer, { src: "/videos/FractionMultiplication.mp4", poster: "/images/feature1-poster.jpg", muted: true, autoPlay: true, loop: true, controls: false, className: "w-full aspect-video", onError: function () { return handleVideoError('feature1'); } })),
                    react_1.default.createElement("div", { className: "p-6" },
                        react_1.default.createElement("h3", { className: "text-xl font-bold text-gray-900" }, "Personlig tr\u00E4ningsplan"),
                        react_1.default.createElement("p", { className: "mt-2 text-gray-600" }, "F\u00E5 en skr\u00E4ddarsydd tr\u00E4ningsplan baserad p\u00E5 dina styrkor och svagheter."))),
                react_1.default.createElement("div", { className: "bg-white rounded-lg shadow-md overflow-hidden" },
                    videoError['feature2'] ? (react_1.default.createElement("div", { className: "w-full aspect-video bg-gray-100 flex items-center justify-center" },
                        react_1.default.createElement("p", { className: "text-gray-500 text-center p-4" }, "Video om detaljerad feedback"))) : (react_1.default.createElement(VideoPlayer_1.VideoPlayer, { src: "/videos/FractionAddition.mp4", poster: "/images/feature2-poster.jpg", muted: true, autoPlay: true, loop: true, controls: false, className: "w-full aspect-video", onError: function () { return handleVideoError('feature2'); } })),
                    react_1.default.createElement("div", { className: "p-6" },
                        react_1.default.createElement("h3", { className: "text-xl font-bold text-gray-900" }, "Detaljerad feedback"),
                        react_1.default.createElement("p", { className: "mt-2 text-gray-600" }, "F\u00E5 detaljerad feedback p\u00E5 dina svar f\u00F6r att f\u00F6rst\u00E5 dina misstag och f\u00F6rb\u00E4ttra dig."))),
                react_1.default.createElement("div", { className: "bg-white rounded-lg shadow-md overflow-hidden" },
                    videoError['feature3'] ? (react_1.default.createElement("div", { className: "w-full aspect-video bg-gray-100 flex items-center justify-center" },
                        react_1.default.createElement("p", { className: "text-gray-500 text-center p-4" }, "Video om provsimuleringar"))) : (react_1.default.createElement(VideoPlayer_1.VideoPlayer, { src: "/videos/feature3.mp4", poster: "/images/feature3-poster.jpg", muted: true, autoPlay: true, loop: true, controls: false, className: "w-full aspect-video", onError: function () { return handleVideoError('feature3'); } })),
                    react_1.default.createElement("div", { className: "p-6" },
                        react_1.default.createElement("h3", { className: "text-xl font-bold text-gray-900" }, "Realistiska provsimuleringar"),
                        react_1.default.createElement("p", { className: "mt-2 text-gray-600" }, "\u00D6va under realistiska f\u00F6rh\u00E5llanden med tidsbegr\u00E4nsade provsimuleringar."))))),
        react_1.default.createElement("section", { id: "how-it-works", className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white scroll-mt-20" },
            react_1.default.createElement("div", { className: "text-center mb-16" },
                react_1.default.createElement("h2", { className: "text-3xl font-bold text-gray-900" }, "Hur fungerar HPGrind?"),
                react_1.default.createElement("p", { className: "mt-4 text-xl text-gray-600 max-w-3xl mx-auto" }, "HPGrind anv\u00E4nder avancerad teknik f\u00F6r att ge dig en personlig tr\u00E4ningsupplevelse.")),
            react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
                react_1.default.createElement("div", { className: "bg-blue-50 p-6 rounded-lg" },
                    react_1.default.createElement("div", { className: "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold" }, "1"),
                    react_1.default.createElement("h3", { className: "text-xl font-bold mb-2" }, "Diagnostisering"),
                    react_1.default.createElement("p", null, "Vi analyserar dina styrkor och svagheter genom anpassade \u00F6vningar.")),
                react_1.default.createElement("div", { className: "bg-blue-50 p-6 rounded-lg" },
                    react_1.default.createElement("div", { className: "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold" }, "2"),
                    react_1.default.createElement("h3", { className: "text-xl font-bold mb-2" }, "Personlig plan"),
                    react_1.default.createElement("p", null, "Baserat p\u00E5 din profil skapar vi en skr\u00E4ddarsydd tr\u00E4ningsplan.")),
                react_1.default.createElement("div", { className: "bg-blue-50 p-6 rounded-lg" },
                    react_1.default.createElement("div", { className: "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold" }, "3"),
                    react_1.default.createElement("h3", { className: "text-xl font-bold mb-2" }, "Kontinuerlig f\u00F6rb\u00E4ttring"),
                    react_1.default.createElement("p", null, "Systemet anpassar sig efter dina framsteg f\u00F6r att maximera resultatet.")))),
        react_1.default.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50 rounded-lg" },
            react_1.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" },
                react_1.default.createElement("div", { className: "rounded-lg overflow-hidden shadow-xl" }, videoError['testimonial'] ? (react_1.default.createElement("div", { className: "w-full aspect-video bg-gray-100 flex items-center justify-center" },
                    react_1.default.createElement("p", { className: "text-gray-500 text-center p-4" }, "Anv\u00E4ndarber\u00E4ttelse kommer snart"))) : (react_1.default.createElement(VideoPlayer_1.VideoPlayer, { src: "/videos/testimonial.mp4", poster: "/images/testimonial-poster.jpg", muted: true, autoPlay: true, loop: true, controls: false, className: "w-full aspect-video", onError: function () { return handleVideoError('testimonial'); } }))),
                react_1.default.createElement("div", { className: "space-y-6" },
                    react_1.default.createElement("h2", { className: "text-3xl font-bold text-gray-900" }, "H\u00F6r vad v\u00E5ra anv\u00E4ndare s\u00E4ger"),
                    react_1.default.createElement("blockquote", { className: "text-xl italic text-gray-600" }, "\"Tack vare HPGrind f\u00F6rb\u00E4ttrade jag mitt resultat fr\u00E5n 0.8 till 1.6 p\u00E5 bara tv\u00E5 m\u00E5nader. Jag kom in p\u00E5 l\u00E4karprogrammet p\u00E5 f\u00F6rsta f\u00F6rs\u00F6ket!\""),
                    react_1.default.createElement("p", { className: "font-medium text-gray-900" }, "\u2014 Emma Johansson, L\u00E4karstudent")))),
        react_1.default.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center" },
            react_1.default.createElement("h2", { className: "text-3xl font-bold text-gray-900" }, "Redo att f\u00F6rb\u00E4ttra dina resultat?"),
            react_1.default.createElement("p", { className: "mt-4 text-xl text-gray-600 max-w-3xl mx-auto" }, "B\u00F6rja din resa mot ett b\u00E4ttre resultat p\u00E5 h\u00F6gskoleprovet idag."),
            react_1.default.createElement("div", { className: "mt-8" }, !isLoggedIn && (react_1.default.createElement("button", { onClick: onShowLogin, className: "px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg" }, "Skapa konto"))))));
};
exports.LandingPage = LandingPage;
