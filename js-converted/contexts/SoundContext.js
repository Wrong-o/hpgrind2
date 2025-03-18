"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSound = exports.SoundProvider = void 0;
var react_1 = require("react");
var SoundContext = (0, react_1.createContext)({
    isMuted: false,
    toggleMute: function () { },
});
var SoundProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(false), isMuted = _b[0], setIsMuted = _b[1];
    var toggleMute = function () {
        setIsMuted(!isMuted);
    };
    return (react_1.default.createElement(SoundContext.Provider, { value: { isMuted: isMuted, toggleMute: toggleMute } }, children));
};
exports.SoundProvider = SoundProvider;
var useSound = function () { return (0, react_1.useContext)(SoundContext); };
exports.useSound = useSound;
