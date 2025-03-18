"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPlayer = void 0;
var react_1 = require("react");
var VideoPlayer = function (_a) {
    var src = _a.src, poster = _a.poster, _b = _a.autoPlay, autoPlay = _b === void 0 ? false : _b, _c = _a.muted, muted = _c === void 0 ? false : _c, _d = _a.loop, loop = _d === void 0 ? false : _d, _e = _a.controls, controls = _e === void 0 ? true : _e, _f = _a.className, className = _f === void 0 ? '' : _f, onEnded = _a.onEnded, onError = _a.onError;
    var videoRef = (0, react_1.useRef)(null);
    var _g = (0, react_1.useState)(autoPlay), isPlaying = _g[0], setIsPlaying = _g[1];
    (0, react_1.useEffect)(function () {
        var videoElement = videoRef.current;
        if (!videoElement)
            return;
        if (autoPlay) {
            videoElement.muted = true;
            var playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(function (error) {
                    console.warn('Autoplay was prevented:', error);
                });
            }
            setIsPlaying(true);
        }
    }, [autoPlay]);
    (0, react_1.useEffect)(function () {
        var videoElement = videoRef.current;
        if (!videoElement)
            return;
        var handleEnded = function () {
            setIsPlaying(false);
            if (onEnded)
                onEnded();
        };
        var handleError = function () {
            if (onError)
                onError();
        };
        videoElement.addEventListener('ended', handleEnded);
        videoElement.addEventListener('error', handleError);
        return function () {
            videoElement.removeEventListener('ended', handleEnded);
            videoElement.removeEventListener('error', handleError);
        };
    }, [onEnded, onError]);
    var togglePlay = function () {
        if (!videoRef.current)
            return;
        if (isPlaying) {
            videoRef.current.pause();
        }
        else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    return (react_1.default.createElement("div", { className: "relative ".concat(className) },
        react_1.default.createElement("video", { ref: videoRef, src: src, poster: poster, autoPlay: autoPlay, muted: muted, loop: loop, controls: controls, className: "w-full h-full rounded-lg", playsInline: true }),
        !controls && isPlaying === false && (react_1.default.createElement("div", { onClick: togglePlay, className: "absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 cursor-pointer" },
            react_1.default.createElement("svg", { className: "w-16 h-16 text-white", fill: "currentColor", viewBox: "0 0 24 24" },
                react_1.default.createElement("path", { d: "M8 5v14l11-7z" }))))));
};
exports.VideoPlayer = VideoPlayer;
